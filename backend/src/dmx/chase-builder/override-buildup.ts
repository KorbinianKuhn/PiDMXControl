import { Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import { getChaseColorValues } from './chase-utils';

export const createChaseBuildup4 = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_4, color);
  const colors = getChaseColorValues(color);

  return chase;
};
