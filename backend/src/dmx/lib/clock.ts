import { Subject } from 'rxjs';
import { TypedServer } from '../../server/events.interfaces';
import { Config } from './config';

export class Clock {
  private timer: NodeJS.Timer;

  public tick$ = new Subject<void>();
  public counter = 0;

  constructor(private io: TypedServer, private config: Config) {
    this.config.speed$.subscribe((speed) => this._start(speed));
  }

  _start(speed: number) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.counter = -1;
    this.timer = setInterval(() => this._next(), speed);
  }

  _next() {
    this.tick$.next();
    this.counter = this.counter === 3 ? 0 : this.counter + 1;
    this.io.emit('tick:updated', { value: this.counter });
  }

  setStart() {
    this._start(this.config.speed$.getValue());
  }
}
