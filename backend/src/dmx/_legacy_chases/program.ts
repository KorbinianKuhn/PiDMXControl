import { TypedServer } from '../../server/events.interfaces';
import { Logger } from '../../utils/logger';
import { bpmToMs } from '../../utils/time';
import { Chase } from './chase';

export class Program {
  private speed: number = bpmToMs(128);

  private timer: NodeJS.Timer;

  private chaseIndex = 0;
  private stepIndex = 0;
  private chases: Chase[] = [];
  private logger = new Logger('program');
  private tick = 0;

  constructor(private io: TypedServer) {}

  _start() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.tick = -1;
    this.stepIndex = -1;
    this.chaseIndex = 0;

    this._next();
    this.timer = setInterval(() => this._next(), this.speed);
  }

  _next() {
    this.tick = this.tick == 3 ? 0 : this.tick + 1;
    this.io.emit('tick:updated', { value: this.tick });

    if (this.chases.length === 0) {
      return;
    }

    if (this.chaseIndex >= this.chases.length) {
      this.chaseIndex = 0;
    }

    const chase = this.chases[this.chaseIndex];

    if (this.stepIndex >= chase.length - 1) {
      this.chaseIndex =
        this.chases.length - 1 === this.chaseIndex ? 0 : this.chaseIndex + 1;
      this.stepIndex = -1;
    }

    this.stepIndex++;

    this.io.emit('chase:updated', { value: this.chaseIndex });
    this.io.emit('step:updated', { value: this.stepIndex });

    // this.logger.info(`Chase ${chase.name} - Step ${this.stepIndex}`);
  }

  setSpeed(value: number) {
    this.speed = value;
    this._start();
  }

  setStart() {
    this._start();
  }

  setChases(chases: Chase[]) {
    this.chases = chases;
    this._start();
  }

  data() {
    if (this.chases.length === 0) {
      return Buffer.alloc(512 + 1, 0);
    }

    return this.chases[this.chaseIndex].data(this.stepIndex);
  }
}
