import { Logger } from '../../utils/logger';
import { createChaseClub } from '../chase-builder/chase-club';
import { createChaseMoody } from '../chase-builder/chase-moody';
import { createChaseOn } from '../chase-builder/chase-on';
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
      this.chases.push(createChaseMoody(this.devices, color));
      this.chases.push(createChaseClub(this.devices, color));
    }

    for (const chase of this.chases.filter(
      (o) => o.color === ChaseColor.UV_PINK,
    )) {
      this.logger.info(
        `created ${chase.programName} with ${chase.length} steps`,
      );
    }
  }

  _filter(name: ActiveProgramName | OverrideProgramName): Chase[] {
    return this.chases.filter(
      (o) =>
        o.programName === name && this.config.activeColors.includes(o.color),
    );
  }

  active(name: ActiveProgramName): Chase[] {
    return this._filter(name);
  }

  override(name: OverrideProgramName): Chase[] {
    return this._filter(name);
  }
}
