import { filter } from 'rxjs';
import { Logger } from '../../utils/logger';
import { Chase } from './chase';
import { Clock } from './clock';
import { Config } from './config';

export enum OverrideProgramName {
  DAY = 'day',
  NIGHT = 'night',
  FADE = 'fade',
  WHITE = 'white',
  WARM = 'warm',
  PRIDE = 'pride',
  DISCO = 'disco',
  BUILDUP_BRIGHT = 'buildup-bright',
  BUILDUP_FADEOUT = 'buildup-fadeout',
  BUILDUP_BEAM = 'buildup-beam',
  BUILDUP_BLINDER = 'buildup-blinder',
  BUILDUP_STREAK = 'buildup-streak',
  BUILDUP_BLINK = 'buildup-blink',
  BUILDUP_TEST = 'buildup-test',
  STROBE_FLASH = 'strobe-flash',
  STROBE_SLOWMO = 'strobe-slowmo',
  STROBE_COLOR = 'strobe-color',
  STROBE_WHITE = 'strobe-white',
  STROBE_PIXELS = 'strobe-pixels',
  STROBE_STORM = 'strobe-storm',
  STROBE_SHORT = 'strobe-short',
  STROBE_DOTS = 'strobe-dots',
  STROBE_FLAT = 'strobe-flat',
}

export enum ActiveProgramName {
  ON = 'on',
  MIRROR_BALL = 'mirror-ball',
  GLOW = 'glow',
  MAGIC = 'magic',
  MOODY = 'moody',
  BOUNCY = 'bouncy',
  CLUB = 'club',
  ROUGH = 'rough',
  PULSE = 'pulse',
  DARK = 'dark',
  LATE = 'late',
  WILD = 'wild',
  RAVE = 'rave',
}

export class Program {
  private chaseIndex = 0;
  private stepIndex = 0;
  private pixelStepIndex = 0;
  private chases: Chase[] = [];
  private logger = new Logger(this.constructor.name);

  private isRunning = false;

  get chase(): Chase {
    return this.chases[this.chaseIndex];
  }

  constructor(
    private clock: Clock,
    private config: Config,
    private isOverride: boolean,
  ) {
    this.clock.tick$
      .pipe(filter(() => this.isRunning))
      .subscribe(() => this._next());
    this.clock.microtick$
      .pipe(filter(() => this.isRunning))
      .subscribe(() => this._nextMicrotick());
  }

  _next() {
    try {
      if (this.chases.length === 0) {
        return;
      }

      if (this.chaseIndex >= this.chases.length) {
        this.chaseIndex = 0;
      }

      const chase = this.chases[this.chaseIndex];

      if (this.stepIndex >= chase.length - 1) {
        if (this.isOverride && !this.chases[this.chaseIndex].loop) {
          console.log('here');
          this.config.setOverrideProgram(null);
          this.stop();
          return;
        }

        this.chaseIndex =
          this.chases.length - 1 === this.chaseIndex ? 0 : this.chaseIndex + 1;
        this.stepIndex = -1;
      }

      this.stepIndex++;
    } catch (err: unknown) {
      this.logger.error((err as Error).message, err);
    }
  }

  _nextMicrotick() {
    try {
      if (this.chases.length === 0) {
        return;
      }

      if (this.chaseIndex >= this.chases.length) {
        this.chaseIndex = 0;
      }

      const chase = this.chases[this.chaseIndex];

      if (this.pixelStepIndex >= chase.lengthPixel - 1) {
        this.pixelStepIndex = 0;
      } else {
        this.pixelStepIndex++;
      }
    } catch (err: unknown) {
      this.logger.error((err as Error).message, err);
    }
  }

  start() {
    this.stepIndex = -1;
    this.pixelStepIndex = 0;
    this.chaseIndex = 0;
    this.isRunning = true;
  }

  stop() {
    this.stepIndex = -1;
    this.pixelStepIndex = 0;
    this.chaseIndex = 0;
    this.isRunning = false;
  }

  setChases(chases: Chase[]) {
    this.chases = chases;
    if (this.isOverride) {
      this.start();
    }
  }

  currentChase(): Chase {
    return this.chases[this.chaseIndex];
  }

  data(): Buffer {
    const buffer = Buffer.alloc(512 + 1, 0);

    if (this.chases.length === 0) {
      return buffer;
    }

    try {
      const data = this.chase?.data(this.stepIndex);
      if (data) {
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = data[i];
        }
      }
    } catch (err: unknown) {
      this.logger.error((err as Error).message, err);
    }

    return buffer;
  }

  pixelData(): Buffer {
    if (this.chases.length === 0) {
      return Buffer.alloc(2 * 150 * 4, 0);
    }

    const chase = this.chases[this.chaseIndex];

    if (chase.lengthPixel === 0) {
      return Buffer.alloc(2 * 150 * 4, 0);
    }

    const data = chase.pixelData(this.pixelStepIndex);

    if (data?.length) {
      return Buffer.from(data);
    } else {
      return Buffer.alloc(2 * 150 * 4, 0);
    }
  }

  progress(): { programName: string; color: string; progress: number } {
    const chase = this.chases[this.chaseIndex];

    if (!chase) {
      return { programName: '', color: '', progress: 0 };
    }

    const progress = Math.round((this.stepIndex / chase.length) * 100);

    return {
      programName: chase.programName,
      color: chase.color,
      progress,
    };
  }
}
