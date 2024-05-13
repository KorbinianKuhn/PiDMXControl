import { Logger } from '../../utils/logger';
import { createChaseClub } from '../chase-builder/chase-club';
import { createChaseDark } from '../chase-builder/chase-dark';
import { createChaseLate } from '../chase-builder/chase-late';
import { createChaseMagic } from '../chase-builder/chase-magic';
import { createChaseMirrorBall } from '../chase-builder/chase-mirror-ball';
import { createChaseMoody } from '../chase-builder/chase-moody';
import { createChasePride } from '../chase-builder/chase-pride';
import { createChasePulse } from '../chase-builder/chase-pulse';
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
import { createChaseStrobeDisco } from '../chase-builder/override-disco';
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
  createChaseStrobePixels,
  createChaseStrobeSlowmo,
  createChaseStrobeStorm,
  createChaseStrobeWhite,
} from '../chase-builder/override-strobe';

import { Chase, ChaseColor } from './chase';
import { Config } from './config';
import { DeviceRegistry } from './device-registry';
import { ActiveProgramName, OverrideProgramName } from './program';

export class ChaseRegistry {
  private chases: Chase[] = [];
  private logger = new Logger('chase-registry');

  constructor(private config: Config, private devices: DeviceRegistry) {
    this._createChases();
  }

  _createChases() {
    this.logger.info(`create chases`);

    // Overrides
    this.chases.push(createChaseDay(this.devices));
    this.chases.push(createChaseNight(this.devices));
    this.chases.push(createChaseWhite(this.devices));
    this.chases.push(createChaseWarm(this.devices));
    this.chases.push(createChaseFade(this.devices));
    this.chases.push(createChaseStrobeDisco(this.devices));
    this.chases.push(createChaseStrobeWhite(this.devices));

    for (const color of Object.values(ChaseColor)) {
      // Chases
      // this.chases.push(createChaseOn(this.devices, color));
      this.chases.push(createChasePride(this.devices, color));
      this.chases.push(createChaseMirrorBall(this.devices, color));
      this.chases.push(createChaseMagic(this.devices, color));
      this.chases.push(createChaseMoody(this.devices, color));
      this.chases.push(createChaseClub(this.devices, color));
      this.chases.push(createChaseRough(this.devices, color));
      this.chases.push(createChasePulse(this.devices, color));
      this.chases.push(createChaseDark(this.devices, color));
      this.chases.push(createChaseLate(this.devices, color));
      this.chases.push(createChaseWild(this.devices, color));

      // Buildups
      this.chases.push(createChaseBuildupBright(this.devices, color));
      this.chases.push(createChaseBuildupFadeout(this.devices, color));
      this.chases.push(createChaseBuildupBeam(this.devices, color));
      this.chases.push(createChaseBuildupBlinder(this.devices, color));
      this.chases.push(createChaseBuildupStreak(this.devices, color));
      this.chases.push(createChaseBuildupBlink(this.devices, color));

      // Strobes
      this.chases.push(createChaseStrobeFlash(this.devices, color));
      this.chases.push(createChaseStrobeSlowmo(this.devices, color));
      this.chases.push(createChaseStrobeColor(this.devices, color));
      this.chases.push(createChaseStrobePixels(this.devices, color));
      this.chases.push(createChaseStrobeStorm(this.devices, color));
    }

    for (const chase of this.chases.filter(
      (o) => o.color === ChaseColor.UV_PINK,
    )) {
      this.logger.info(
        `created ${chase.programName} with ${chase.length} steps`,
      );
    }
  }

  update() {
    this.chases = [];
    this._createChases();
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
