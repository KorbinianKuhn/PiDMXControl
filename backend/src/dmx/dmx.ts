import { TypedServer } from '../server/events.interfaces';
import { bpmToMs } from '../utils/time';
import { Chase, ChaseColor, ChaseName } from './chases/chase';
import { createClubChases } from './chases/chase-club';
import { createMoodyChases } from './chases/chase-moody';
import { createOnChases } from './chases/chase-on';
import { Program } from './program/program';
import { DummySerial } from './serial/dummy-serial';
import { UartSerial } from './serial/uart-serial';

export class DMX {
  private serial =
    process.env.CONFIG === 'pi' ? new UartSerial() : new DummySerial();

  public chases: Chase[] = [
    ...createOnChases(),
    ...createMoodyChases(),
    ...createClubChases(),
  ];

  public program = new Program(this.io);

  public master = 255;
  public black = false;
  public strobe = false;
  public colors: ChaseColor[] = [ChaseColor.RED];
  public chaseName = ChaseName.ON;

  constructor(private io: TypedServer) {}

  async init(): Promise<void> {
    await this.serial.init();

    setInterval(async () => {
      this._send();
    }, 46);

    this.setFilteredChases();
  }

  setFilteredChases() {
    const chases = this.chases.filter(
      (o) => o.id === this.chaseName && this.colors.includes(o.color),
    );
    this.program.setChases(chases);
  }

  setBpm(value: number) {
    console.log('set bpm', value);
    const bpm = parseFloat(value.toFixed(1));
    this.program.setSpeed(bpmToMs(bpm));
    this.io.emit('bpm:updated', { value: bpm });
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

  setStrobe(value: boolean) {
    console.log('set strobe', value);
    this.strobe = value;
    this.io.emit('strobe:updated', { value });
  }

  setColors(colors: ChaseColor[]) {
    this.colors = colors;
    this.setFilteredChases();
    this.io.emit('colors:updated', { colors });
  }

  setChaseName(value: ChaseName) {
    this.chaseName = value;
    this.setFilteredChases();
    this.io.emit('chase-name:updated', { value });
  }

  async _send() {
    if (this.black) {
      const data = Buffer.alloc(512 + 1, 0);
      this.serial.write(data);
      this.io.emit('dmx:write', { data: [...data] });
      return;
    }

    const data = this.program.data(this.master, this.strobe);
    await this.serial.write(data);
    this.io.emit('dmx:write', { data: [...data] });
  }
}
