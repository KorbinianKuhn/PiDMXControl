import { Logger } from '../../utils/logger';
import { createChaseClub } from '../chase-builder/chase-club';
import { createChaseMirrorBall } from '../chase-builder/chase-mirror-ball';
import { createChaseMoody } from '../chase-builder/chase-moody';
import { createChaseOn } from '../chase-builder/chase-on';
import { createChaseWild } from '../chase-builder/chase-wild';
import {
  createChaseBuildup16,
  createChaseBuildup4,
  createChaseBuildup8,
  createChaseBuildupInfinite,
} from '../chase-builder/override-buildup';
import { createChaseDisco } from '../chase-builder/override-disco';
import { createChaseFade } from '../chase-builder/override-fade';
import {
  createChaseShortStrobe,
  createChaseStrobe,
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
      this.chases.push(createChaseOn(this.devices, color));
      this.chases.push(createChaseMirrorBall(this.devices, color));
      this.chases.push(createChaseMoody(this.devices, color));
      this.chases.push(createChaseClub(this.devices, color));
      this.chases.push(createChaseWild(this.devices, color));
      this.chases.push(createChaseDisco(this.devices, color));
      this.chases.push(createChaseStrobe(this.devices, color));
      this.chases.push(createChaseFade(this.devices, color));
      this.chases.push(createChaseBuildupInfinite(this.devices, color));
      this.chases.push(createChaseBuildup4(this.devices, color));
      this.chases.push(createChaseBuildup8(this.devices, color));
      this.chases.push(createChaseBuildup16(this.devices, color));
      this.chases.push(createChaseShortStrobe(this.devices, color));
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
