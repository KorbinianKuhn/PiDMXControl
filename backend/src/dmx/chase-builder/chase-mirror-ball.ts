import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceStateValues } from '../lib/device';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
  warp,
} from './chase-utils';

export const createChaseMirrorBall = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.MIRROR_BALL, color);
  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const ball = warp(createBallPattern(devices, colors), 4);
  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(bar, ball, beamer);

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
    dome.state({ master: 255, ...colors.a, movement: 127 }),
    spot.state({ master: 255, ...colors.a }),
  );

  const b = flattenChannelStates(
    dome.state({ master: 255, ...colors.b, movement: 127 }),
    spot.state({ master: 255, ...colors.b }),
  );

  // 1 - 16
  for (let i = 0; i < 16; i++) {
    steps.push(a);
  }

  // 17 - 32
  for (let i = 0; i < 16; i++) {
    steps.push(b);
  }

  return steps;
};

const createBarPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { bar } = devices.object();

  const fadeIn = new Array(16).fill(null).map((o, i) => (i / 16) * 240 + 15);
  const fadeOut = fadeIn.slice().reverse();

  const animation = [
    ...fadeIn,
    ...fadeOut,
    ...fadeIn,
    ...fadeOut,
    ...fadeIn,
    ...fadeOut,
    ...fadeIn,
    ...fadeOut,
  ];

  const getOffsetAnimation = (offset: number): number[] => {
    return [...animation.slice(offset), ...animation.slice(0, offset)];
  };

  const segments = [
    getOffsetAnimation(0),
    getOffsetAnimation(14),
    getOffsetAnimation(6),
    getOffsetAnimation(10),
    getOffsetAnimation(4),
    getOffsetAnimation(15),
    getOffsetAnimation(9),
    getOffsetAnimation(13),
  ];

  for (let i = 0; i < 128; i++) {
    const state = bar.state(
      ...new Array(8).fill(null).map((o, i2) => {
        let color: DeviceStateValues;
        if (i2 % 2) {
          color = i < 64 ? colors.a : colors.b;
        } else {
          color = i < 64 ? colors.b : colors.a;
        }
        return {
          segments: i2,
          master: segments[i2][i],
          ...color,
        };
      }),
    );

    steps.push(state);
  }

  return steps;
};

const createBeamerPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const beamer = devices.object().beamer;

  const a = beamer.state({ master: 255, ...colors.a });
  const b = beamer.state({ master: 255, ...colors.b });

  for (let i = 0; i < 64; i++) {
    steps.push(a);
  }
  for (let i = 0; i < 64; i++) {
    steps.push(b);
  }

  return steps;
};
