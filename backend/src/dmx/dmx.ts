import { TypedServer } from '../server/events.interfaces';
import { bpmToMs } from '../utils/time';
import { Chase, ChaseColor } from './chases/chase';
import { createMoodyChase } from './chases/chase-moody';
import { Program } from './program/program';
import { DummySerial } from './serial/dummy-serial';
import { UartSerial } from './serial/uart-serial';

export class DMX {
  private serial =
    process.env.CONFIG === 'pi' ? new UartSerial() : new DummySerial();

  public chases: Chase[] = [
    createMoodyChase('moody', ChaseColor.RED),
    createMoodyChase('moody', ChaseColor.BLUE),
  ];

  public program = new Program(this.io);

  public master = 255;
  public black = false;
  public colors: ChaseColor[] = [];

  constructor(private io: TypedServer) {}

  async init(): Promise<void> {
    await this.serial.init();

    setInterval(async () => {
      this._send();
    }, 46);

    this.program.setChases(this.chases);
  }

  setBpm(value: number) {
    console.log('set bpm', value);
    const bpm = parseFloat(value.toFixed(1));
    this.program.setSpeed(bpmToMs(bpm));
    this.io.emit('bpm:updated', { value: bpm });
  }

  setColors(colors: ChaseColor[]) {
    this.colors = colors;
  }

  setMaster(value: number) {
    console.log('set master', value);
    this.master = value;
    this.io.emit('master:updated', { value });
  }

  setBlack(value: boolean) {
    console.log('set black', value);
    this.black = value;
    this.io.emit('black:updated', { value });
  }

  async _send() {
    if (this.black) {
      const data = Buffer.alloc(512 + 1, 0);
      this.serial.write(data);
      this.io.emit('dmx:write', { data: [...data] });
      return;
    }

    const data = this.program.data();
    await this.serial.write(data);
    this.io.emit('dmx:write', { data: [...data] });
  }
}
