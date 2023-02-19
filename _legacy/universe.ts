import { Logger } from '../utils/logger';
import { Chase } from './chase';
import { Device } from './device';

const UNIVERSE_LENGTH = 512;

export class Universe {
  private devices: Device[] = [];
  private chases: Chase[] = [];
  private chaseIndex = 0;

  private bpm = 115;

  private state = Buffer.alloc(UNIVERSE_LENGTH + 1);

  private logger = new Logger('universe');

  get speed(): number {
    return (60 * 1000) / this.bpm;
  }

  private lastTap = new Date().valueOf();
  private timer!: NodeJS.Timer;

  constructor() {
    this.restart();
  }

  restart() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this._nextStep();
    }, this.speed);
  }

  tap() {
    const now = new Date().valueOf();
    if (this.lastTap < now - 5000) {
      this.lastTap = now;
      return;
    }
    const diff = now - this.lastTap;
    this.lastTap = now;
    this.bpm = (60 * 1000) / diff;
    this.logger.info(`BPM: ${this.bpm.toString()}`);
    this.restart();
  }

  addDevice(device: Device) {
    this.devices.push(device);
  }

  setChases(chases: Chase[]) {
    this.chases = chases;
    this.chaseIndex = 0;
  }

  _nextStep() {
    const chase = this.chases[this.chaseIndex];
    const index = chase.next();
    this.logger.info(`chase ${this.chaseIndex}, step ${index}`);
    if (index === -1) {
      this._nextChase();
    }
  }

  _nextChase() {
    if (this.chaseIndex === this.chases.length - 1) {
      this.chaseIndex = 0;
      this._nextStep();
    } else {
      this.chaseIndex++;
    }
  }

  getState(): Buffer {
    const chase = this.chases[this.chaseIndex];
    const channels = chase.getState();
    for (const channel of channels) {
      this.state[channel.channel] = channel.value;
    }
    return this.state;
  }
}
