import { throttleTime } from 'rxjs';
import { TypedServer } from '../server/events.interfaces';
import { ChaseColor } from './lib/chase';
import { ChaseRegistry } from './lib/chase-registry';
import { Clock } from './lib/clock';
import { Config } from './lib/config';
import { DeviceRegistry } from './lib/device-registry';
import { SEND_DATA, UART_SERIAL } from './lib/env';
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

  private chases = new ChaseRegistry(this.config, this.devices);

  private activeProgram = new Program(this.io, this.clock, this.config, false);
  private overrideProgram = new Program(this.io, this.clock, this.config, true);

  constructor(private io: TypedServer) {}

  async init(): Promise<void> {
    await this.serial.init();
    await this.mqtt.init();

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

  data(): Buffer {
    if (this.config.settingsMode) {
      return this.config.settingsData;
    }

    this.io.emit('active-program:progress', {
      ...this.activeProgram.progress(),
    });

    this.io.emit('override-program:progress', {
      ...(this.config.overrideProgram
        ? this.overrideProgram.progress()
        : {
            programName: '',
            color: '',
            progress: 0,
          }),
    });

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
      const master = this.config.getDeviceConfig(device.deviceId).master;
      const multiplier = this.config.master * master;
      if (multiplier !== 1) {
        for (const channel of device.channels) {
          data[channel] = Math.round(data[channel] * multiplier);
        }
      }
    }

    return data;
  }

  neopixelData(): Buffer {
    if (this.config.settingsMode || this.config.black) {
      return Buffer.alloc(2 * 150 * 4, 0);
    }
    const buffer = this.config.overrideProgram
      ? this.overrideProgram.pixelData()
      : this.activeProgram.pixelData();

    const master = this.config.getDeviceConfig('neopixel-a').master;
    const multiplier = this.config.master * master;
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] !== 0) {
        buffer[i] = Math.round(buffer[i] * multiplier);
      }
    }

    return buffer;
  }

  async _send() {
    const data = this.data();
    this.mqtt.send('dmx', data);
  }

  async _sendMQTT() {
    const data = this.neopixelData();
    this.mqtt.send('neopixel-a', data.subarray(0, 600));
    this.mqtt.send('neopixel-b', data.subarray(600, 1200));
  }
}
