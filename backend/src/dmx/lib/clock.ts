import { Subject } from 'rxjs';
import { TypedServer } from '../../server/events.interfaces';
import { Config } from './config';

export class Clock {
  private timer: NodeJS.Timer;

  public tick$ = new Subject<number>();
  public microtick$ = new Subject<number>();
  public counter = 0; // 0-64

  constructor(private io: TypedServer, private config: Config) {
    this.config.speed$.subscribe((speed) => this._start(speed));
  }

  _start(speed: number) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.counter = -1;
    this.timer = setInterval(() => this._next(), speed / 16);
  }

  _next() {
    this.counter = this.counter === 63 ? 0 : this.counter + 1;
    if (this.counter % 4 === 0) {
      this.tick$.next(this.counter / 4);
    }
    this.microtick$.next(this.counter);
    this.io.emit('tick:updated', { value: this.counter / 4 });
  }

  setStart() {
    this._start(this.config.speed$.getValue());
  }
}
