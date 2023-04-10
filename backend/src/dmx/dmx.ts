import { TypedServer } from '../server/events.interfaces';
import { ChaseColor } from './lib/chase';
import { ChaseRegistry } from './lib/chase-registry';
import { Clock } from './lib/clock';
import { Config } from './lib/config';
import { DeviceRegistry } from './lib/device-registry';
import { ActiveProgramName, OverrideProgramName, Program } from './lib/program';
import { DummySerial } from './lib/serial/dummy-serial';
import { UartSerial } from './lib/serial/uart-serial';

export class DMX {
  private serial =
    process.env.CONFIG === 'pi' ? new UartSerial() : new DummySerial();

  public config = new Config(this.io);

  private devices = new DeviceRegistry(this.config);
  private clock = new Clock(this.io, this.config);

  private chases = new ChaseRegistry(this.config, this.devices);

  private activeProgram = new Program(this.io, this.clock, this.config);
  private overrideProgram = new Program(this.io, this.clock, this.config);

  constructor(private io: TypedServer) {}

  async init(): Promise<void> {
    await this.serial.init();

    setInterval(async () => {
      this._send();
    }, 46);

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

    if (this.config.black) {
      return Buffer.alloc(512 + 1, 0);
    }

    const data = this.config.overrideProgram
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

  async _send() {
    const data = this.data();
    await this.serial.write(data);
    this.io.emit('dmx:write', { buffer: [...data] });
  }
}
