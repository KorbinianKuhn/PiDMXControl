import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  getDomeColorValue,
  mergeDevicePatterns,
} from './chase-utils';

export const createChaseMirrorBall = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.MIRROR_BALL, true, color);
  const colors = getChaseColorValues(color);

  const { dome, spot } = devices.object();

  const ball: ChannelAnimation = [];

  const a = flattenChannelStates(
    dome.state({ master: 255, ...getDomeColorValue(colors.a), movement: 127 }),
    spot.state({ master: 255, ...colors.a }),
  );

  const b = flattenChannelStates(
    dome.state({ master: 255, ...getDomeColorValue(colors.b), movement: 127 }),
    spot.state({ master: 255, ...colors.b }),
  );

  for (let i = 0; i < 32; i++) {
    ball.push(a);
  }

  for (let i = 0; i < 32; i++) {
    ball.push(b);
  }

  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(ball, beamer);

  chase.addSteps(steps);

  return chase;
};

const createBeamerPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const beamer = devices.object().beamer;

  const a = beamer.state({ master: 255, ...colors.a });
  const b = beamer.state({ master: 255, ...colors.b });

  for (let i = 0; i < 32; i++) {
    steps.push(a);
  }
  for (let i = 0; i < 32; i++) {
    steps.push(b);
  }

  return steps;
};
