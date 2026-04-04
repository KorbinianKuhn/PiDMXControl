import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  flattenChannelStates,
  getChaseColorValues,
  getDomeColorValue,
} from './chase-utils';

export const createChaseMirrorBall = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.MIRROR_BALL, true, color);
  const colors = getChaseColorValues(color);

  const { dome, spot } = devices.object();

  const steps: ChannelAnimation = [];

  const a = flattenChannelStates(
    dome.state({ master: 255, ...getDomeColorValue(colors.a), movement: 127 }),
    spot.state({ master: 255, ...colors.a }),
  );

  const b = flattenChannelStates(
    dome.state({ master: 255, ...getDomeColorValue(colors.b), movement: 127 }),
    spot.state({ master: 255, ...colors.b }),
  );

  for (let i = 0; i < 32; i++) {
    steps.push(a);
  }

  for (let i = 0; i < 32; i++) {
    steps.push(b);
  }

  chase.addSteps(steps);

  return chase;
};
