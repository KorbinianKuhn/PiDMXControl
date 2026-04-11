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
      this.overrideProgram.reset();
      this.io.emit('override-program:progress', {
        programName: '',
        color: '',
        progress: 0,
      });
    } else {
      this.overrideProgram.setChases(
        this.chases.override(value, this.activeProgram.currentChase()?.color),
      );
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

  data(dmx: boolean): Buffer {
    if (this.config.testChannelMode) {
      return this.config.testChannelData;
    }

    this.io.emit('active-program:progress', {
      ...this.activeProgram.progress(),
    });

    if (this.config.overrideProgram) {
      this.io.emit('override-program:progress', {
        ...this.overrideProgram.progress(),
      });
    }

    if (this.config.black) {
      return Buffer.alloc(512 + 1, 0);
    }

    const data: Buffer = this.config.overrideProgram
      ? this.overrideProgram.data()
      : this.activeProgram.data();

    // UV override
    if (this.config.ambientUV !== 0) {
      for (const address of this.devices.ambientUVChannels) {
        data[address] = Math.max(data[address], this.config.ambientUV);
      }
      for (const address of this.devices.ambientUVMasterChannels) {
        data[address] = 255;
      }
    }

    // Master override
    for (const device of this.devices.masterChannels) {
      const config = this.config.getDeviceConfig(device.deviceId);
      if (config.disabled) {
        for (const channel of device.channels) {
          data[channel] = 0;
        }
      } else if (dmx) {
        const multiplier = this.config.master * config.master;
        if (multiplier !== 1) {
          for (const channel of device.channels) {
            data[channel] = Math.round(data[channel] * multiplier);
          }
        }
      }
    }

    return data;
  }

  neopixelData(dmx: boolean): Buffer {
    if (this.config.testChannelMode || this.config.black) {
      return Buffer.alloc(2 * 150 * 4, 0);
    }
    const buffer = this.config.overrideProgram
      ? this.overrideProgram.pixelData()
      : this.activeProgram.pixelData();

    if (dmx) {
      const master = this.config.getDeviceConfig('neopixel-a').master;
      const multiplier = this.config.master * master;
      for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] !== 0) {
          buffer[i] = Math.round(buffer[i] * multiplier);
        }
      }
    }

    return buffer;
  }

  async _send() {
    const dmx = this.data(true);
    this.mqtt.send('dmx', dmx);

    const visualisation = this.data(false);
    this.mqtt.send('visualisation/dmx', visualisation);
  }

  async _sendMQTT() {
    const dmx = this.neopixelData(true);
    this.mqtt.send('neopixel-a', dmx.subarray(0, 600));
    this.mqtt.send('neopixel-b', dmx.subarray(600, 1200));

    const visualisation = this.neopixelData(false);
    this.mqtt.send('visualisation/neopixel-a', visualisation.subarray(0, 600));
    this.mqtt.send(
      'visualisation/neopixel-b',
      visualisation.subarray(600, 1200),
    );
  }
}
