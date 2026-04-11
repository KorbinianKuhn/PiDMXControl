import { BehaviorSubject } from 'rxjs';
import { TypedServer } from '../../server/events.interfaces';
import { Logger } from '../../utils/logger';
import { createChaseBouncy } from '../chase-builder/chase-bouncy';
import { createChaseClub } from '../chase-builder/chase-club';
import { createChaseDark } from '../chase-builder/chase-dark';
import { createChaseGlow } from '../chase-builder/chase-glow';
import { createChaseLate } from '../chase-builder/chase-late';
import { createChaseMagic } from '../chase-builder/chase-magic';
import { createChaseMirrorBall } from '../chase-builder/chase-mirror-ball';
import { createChaseMoody } from '../chase-builder/chase-moody';
import { createChasePulse } from '../chase-builder/chase-pulse';
import { createChaseRave } from '../chase-builder/chase-rave';
import { createChaseRough } from '../chase-builder/chase-rough';
import { createChaseWild } from '../chase-builder/chase-wild';
import {
  createChaseBuildupBeam,
  createChaseBuildupBlinder,
  createChaseBuildupBlink,
  createChaseBuildupBright,
  createChaseBuildupFadeout,
  createChaseBuildupStreak,
} from '../chase-builder/override-buildup';
import { createChaseDisco } from '../chase-builder/override-disco';
import { createChasePride } from '../chase-builder/override-pride';
import {
  createChaseDay,
  createChaseFade,
  createChaseNight,
  createChaseWarm,
  createChaseWhite,
} from '../chase-builder/override-static';
import {
  createChaseStrobeColor,
  createChaseStrobeFlash,
  createChaseStrobeFlat,
  createChaseStrobeShort,
  createChaseStrobeSlowmo,
  createChaseStrobeStorm,
  createChaseStrobeWhite,
} from '../chase-builder/override-strobe';

import { wait } from '../../utils/time';
import { Chase, ChaseColor } from './chase';
import { Config } from './config';
import { DeviceRegistry } from './device-registry';
import { ActiveProgramName, OverrideProgramName } from './program';

export class ChaseRegistry {
  private chases: Chase[] = [];
  private logger = new Logger('chase-registry');

  public progress$ = new BehaviorSubject(0);

  constructor(
    private io: TypedServer,
    private config: Config,
    private devices: DeviceRegistry,
  ) {}

  async init() {
    this.chases = [];

    const overrides = [
      // Chases
      createChaseDay,
      createChaseNight,
      createChaseWhite,
      createChaseWarm,
      createChaseFade,
      createChasePride,
      createChaseDisco,

      // Strobes
      createChaseStrobeSlowmo,
      createChaseStrobeWhite,
      createChaseStrobeShort,
      createChaseStrobeFlat,
    ];

    const chases = [
      createChaseMirrorBall,
      createChaseGlow,
      createChaseMagic,
      createChaseMoody,
      createChaseBouncy,
      createChaseClub,
      createChaseRough,
      createChasePulse,
      createChaseDark,
      createChaseLate,
      createChaseWild,
      createChaseRave,

      // Buildups
      createChaseBuildupBright,
      createChaseBuildupFadeout,
      createChaseBuildupBeam,
      createChaseBuildupBlinder,
      createChaseBuildupStreak,
      createChaseBuildupBlink,

      // Strobes
      createChaseStrobeFlash,
      createChaseStrobeColor,
      createChaseStrobeStorm,
    ];

    const tasks = [
      ...overrides.map((func) => () => func(this.devices)),
      ...Object.values(ChaseColor).map((color) =>
        chases.map((func) => () => func(this.devices, color)),
      ),
    ].flat();

    this.logger.info(`creating chases`);
    this.progress$.next(0);
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      const chase = task();
      this.chases.push(chase);

      const progress = parseInt(((i / tasks.length) * 100).toFixed(0));
      this.logger.info(`${progress}% (${i + 1}/${tasks.length})`);
      if (progress !== this.progress$.getValue()) {
        this.progress$.next(progress);
      }
      await wait(1);
    }
    this.logger.info('chases created');
  }

  active(name: ActiveProgramName): Chase[] {
    return this.chases.filter(
      (o) =>
        o.programName === name && this.config.activeColors.includes(o.color),
    );
  }

  override(name: OverrideProgramName, color: ChaseColor): Chase[] {
    return this.chases.filter((o) => {
      if (o.programName !== name) {
        return false;
      }

      if (o.color === undefined) {
        return true;
      }

      return o.color === color;
    });
  }
}
