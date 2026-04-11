import { BehaviorSubject, throttleTime } from 'rxjs';
import { SEND_DATA, UART_SERIAL } from '../env';
import { ServerStatus, TypedServer } from '../server/events.interfaces';
import { ChaseColor } from './lib/chase';
import { ChaseRegistry } from './lib/chase-registry';
import { Clock } from './lib/clock';
import { Config } from './lib/config';
import { Device } from './lib/device';
import { DeviceRegistry } from './lib/device-registry';
import { MQTT } from './lib/mqtt/mqtt';
import { ActiveProgramName, OverrideProgramName, Program } from './lib/program';
import { DummySerial } from './lib/serial/dummy-serial';
import { UartSerial } from './lib/serial/uart-serial';

export class DMX {
  private serial = UART_SERIAL ? new UartSerial() : new DummySerial();
  private mqtt = new MQTT();

  public config = new Config(this.io);

  private devices = new DeviceRegistry(this.config);
  private clock = new Clock(this.io, this.config);

  private chases = new ChaseRegistry(this.io, this.config, this.devices);

  private activeProgram = new Program(this.clock, this.config, false);
  private overrideProgram = new Program(this.clock, this.config, true);

  public status$ = new BehaviorSubject<ServerStatus>({
    value: 'init',
    progress: 0,
  });

  get isReady() {
    return this.status$.getValue().value === 'ready';
  }

  constructor(private io: TypedServer) {
    this.chases.progress$.subscribe((progress) =>
      this.status$.next({
        value: 'init',
        progress,
      }),
    );
  }

  listDevices(): Device[] {
    return this.devices.list();
  }

  async init(): Promise<void> {
    this.clock.disable();

    await this.serial.init();
    await this.mqtt.init();

    await this.chases.init();

    this.status$.next({
      value: 'ready',
    });

    this.mqtt.subscribe((topic, message) => {
      if (topic === 'dmx') {
        this.serial.write(message);
      }
    });

    if (SEND_DATA) {
      this.clock.microtick$.pipe(throttleTime(46)).subscribe(() => {
        if (!this.config.getDeviceConfig('neopixel-a').disabled) {
          this._sendMQTT();
        }
        this._send();
      });
    }

    this.setActiveProgram(this.config.activeProgram);
    this.activeProgram.start();
    this.clock.enable();
  }

  setStart() {
    this.clock.setStart();
    if (this.config.overrideProgram) {
      this.overrideProgram.start();
    } else {
      this.activeProgram.start();
    }
  }

  setOverrideProgram(value: OverrideProgramName | null) {
    this.config.setOverrideProgram(value);
    if (value === null) {
      this.overrideProgram.stop();
    } else {
      this.overrideProgram.setChases(
        this.chases.override(value, this.activeProgram.currentChase()?.color),
      );
      this.overrideProgram.start();
    }
  }

  setActiveProgram(value: ActiveProgramName) {
    this.config.setActiveProgram(value);
    this.activeProgram.setChases(this.chases.active(value));
  }

  setActiveColors(value: ChaseColor[]) {
    this.config.setActiveColors(value);
    this.activeProgram.setChases(this.chases.active(this.config.activeProgram));
  }

  data(): { dmx: Buffer; visualisation: Buffer } {
    if (this.config.testChannelMode) {
      const data = this.config.testChannelData;
      return { dmx: data, visualisation: data };
    }

    this.io.emit('active-program:progress', {
      ...this.activeProgram.progress(),
    });

    if (this.config.overrideProgram) {
      this.io.emit('override-program:progress', {
        ...this.overrideProgram.progress(),
      });
    }

    const visualisation: Buffer = this.config.overrideProgram
      ? this.overrideProgram.data()
      : this.activeProgram.data();

    const dmx = Buffer.from(visualisation);

    // Overrides
    for (const channel of this.devices.overrides) {
      // Black
      if (channel.disabled || this.config.black) {
        visualisation[channel.address] = 0;
        dmx[channel.address] = 0;
        continue;
      }

      // UV
      if (this.config.ambientUV !== 0 && channel.uv) {
        visualisation[channel.uv] = Math.max(
          visualisation[channel.uv],
          this.config.ambientUV,
        );
        visualisation[channel.address] = 255;
        dmx[channel.uv] = Math.max(dmx[channel.uv], this.config.ambientUV);
        dmx[channel.address] = 255;
      }

      // Master
      const multiplier = this.config.master * channel.master;
      if (multiplier !== 1) {
        dmx[channel.address] = Math.round(dmx[channel.address] * multiplier);
      }
    }

    return {
      dmx,
      visualisation,
    };
  }

  neopixelData(): { dmx: Buffer; visualisation: Buffer } {
    if (this.config.testChannelMode || this.config.black) {
      const data = Buffer.alloc(2 * 150 * 4, 0);
      return {
        dmx: data,
        visualisation: data,
      };
    }

    const visualisation = this.config.overrideProgram
      ? this.overrideProgram.pixelData()
      : this.activeProgram.pixelData();

    const dmx = Buffer.from(visualisation);
    const master = this.config.getDeviceConfig('neopixel-a').master;
    const multiplier = this.config.master * master;
    for (let i = 0; i < dmx.length; i++) {
      if (dmx[i] !== 0) {
        dmx[i] = Math.round(dmx[i] * multiplier);
      }
    }

    return {
      dmx,
      visualisation,
    };
  }

  async _send() {
    const { dmx, visualisation } = this.data();
    this.mqtt.send('dmx', dmx);
    this.mqtt.send('visualisation/dmx', visualisation);
  }

  async _sendMQTT() {
    const { dmx, visualisation } = this.neopixelData();
    this.mqtt.send('neopixel-a', dmx.subarray(0, 600));
    this.mqtt.send('neopixel-b', dmx.subarray(600, 1200));

    this.mqtt.send('visualisation/neopixel-a', visualisation.subarray(0, 600));
    this.mqtt.send(
      'visualisation/neopixel-b',
      visualisation.subarray(600, 1200),
    );
  }
}
