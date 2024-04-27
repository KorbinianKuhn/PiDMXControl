import { Logger } from '../../utils/logger';
import { createChaseClub } from '../chase-builder/chase-club';
import { createChaseDark } from '../chase-builder/chase-dark';
import {
  createChaseDay,
  createChaseNight,
} from '../chase-builder/chase-day-night';
import { createChaseMagic } from '../chase-builder/chase-magic';
import { createChaseMirrorBall } from '../chase-builder/chase-mirror-ball';
import { createChaseMoody } from '../chase-builder/chase-moody';
import { createChasePulse } from '../chase-builder/chase-pulse';
import { createChaseWild } from '../chase-builder/chase-wild';
import {
  createChaseBuildupBlinder,
  createChaseBuildupBright,
  createChaseBuildupFadeout,
  createChaseBuildupInfinite,
} from '../chase-builder/override-buildup';
import { createChaseDisco } from '../chase-builder/override-disco';
import { createChaseFade } from '../chase-builder/override-fade';
import {
  createChaseStrobeA,
  createChaseStrobeB,
  createChaseStrobeC,
  createChaseStrobeD,
  createChaseStrobeInfinite,
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

    for (const color of Object.values(ChaseColor)) {
      // Chases
      // this.chases.push(createChaseOn(this.devices, color));
      this.chases.push(createChaseMirrorBall(this.devices, color));
      this.chases.push(createChaseMagic(this.devices, color));
      this.chases.push(createChaseMoody(this.devices, color));
      this.chases.push(createChaseClub(this.devices, color));
      this.chases.push(createChasePulse(this.devices, color));
      this.chases.push(createChaseDark(this.devices, color));
      this.chases.push(createChaseWild(this.devices, color));
      this.chases.push(createChaseDisco(this.devices, color));

      // Overrides
      this.chases.push(createChaseDay(this.devices, color));
      this.chases.push(createChaseNight(this.devices, color));
      this.chases.push(createChaseFade(this.devices, color));

      // Buildups
      this.chases.push(createChaseBuildupBright(this.devices, color));
      this.chases.push(createChaseBuildupFadeout(this.devices, color));
      this.chases.push(createChaseBuildupBlinder(this.devices, color));
      this.chases.push(createChaseBuildupInfinite(this.devices, color));

      // Strobes
      this.chases.push(createChaseStrobeA(this.devices, color));
      this.chases.push(createChaseStrobeB(this.devices, color));
      this.chases.push(createChaseStrobeC(this.devices, color));
      this.chases.push(createChaseStrobeD(this.devices, color));
      this.chases.push(createChaseStrobeInfinite(this.devices, color));
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
    return this.chases.filter(
      (o) => o.programName === name && o.color === color,
    );
  }
}
