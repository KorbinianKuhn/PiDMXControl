import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
} from './chase-utils';

export const createChaseMirrorBall = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.MIRROR_BALL, color);
  const colors = getChaseColorValues(color);

  const ball = createBallPattern(devices, colors);

  const steps = mergeDevicePatterns(ball);

  chase.addSteps(steps);

  return chase;
};

const createBallPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { dome, spot } = devices.object();

  const a = flattenChannelStates(
    dome.state({ master: 255, ...colors.a }),
    spot.state({ master: 255, ...colors.a }),
  );

  const b = flattenChannelStates(
    dome.state({ master: 255, ...colors.b }),
    spot.state({ master: 255, ...colors.b }),
  );

  // 1 - 32
  for (let i = 0; i < 32; i++) {
    steps.push(a);
  }

  // 33 - 64
  for (let i = 0; i < 32; i++) {
    steps.push(b);
  }

  const animationDome = dome.animationRotate(steps.length);
  for (let i = 0; i < steps.length; i++) {
    steps[i].push(...animationDome[i]);
  }

  return steps;
};
