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

  private devices = new DeviceRegistry();
  public config = new Config(this.io);
  private clock = new Clock(this.io, this.config);

  private chases = new ChaseRegistry(this.config, this.devices);

  private activeProgram = new Program(this.io, this.clock);
  private overrideProgram = new Program(this.io, this.clock);

  constructor(private io: TypedServer) {}

  async init(): Promise<void> {
    await this.serial.init();

    setInterval(async () => {
      this._send();
    }, 46);

    this.setActiveProgram(this.config.activeProgram);
  }

  setBpm(value: number) {
    this.config.setBpm(value);
  }

  setStart() {
    this.clock.setStart();
    if (this.config.overrideProgram) {
      this.overrideProgram.start();
    } else {
      this.activeProgram.start();
    }
  }

  setMaster(value: number) {
    this.config.setMaster(value);
  }

  setBlack(value: boolean) {
    this.config.setBlack(value);
  }

  setAmbientUV(value: number) {
    this.config.setAmbientUV(value);
  }

  setOverrideProgram(value: OverrideProgramName | null) {
    this.config.setOverrideProgram(value);
    if (value === null) {
      this.overrideProgram.reset();
    } else {
      this.overrideProgram.setChases(this.chases.override(value));
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
    if (this.config.master !== 1) {
      for (const address of this.devices.masterChannels) {
        data[address] *= this.config.master;
      }
    }

    return data;
  }

  async _send() {
    const data = this.data();
    await this.serial.write(data);
    this.io.emit('dmx:write', { data: [...data] });
  }
}
