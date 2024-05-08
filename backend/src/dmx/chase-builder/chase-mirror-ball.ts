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
  const hex = createHexPattern(devices, colors);
  const ball = warp(createBallPattern(devices, colors), 4);
  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(bar, hex, ball, beamer);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  chase.addPixelSteps(createPixelPattern(devices, colors));

  return chase;
};

const createHexPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { a, b, c, d, e, all } = devices.object().hex;

  const hex = [a, b, c, d, e];

  const fadeIn = new Array(8).fill(null).map((o, i) => (i / 8) * 240 + 15);
  const fadeOut = fadeIn.slice().reverse();
  const animation = [...fadeIn, ...fadeOut];

  for (let i = 0; i < 8; i++) {
    const color = i % 2 ? colors.b : colors.a;
    for (let i2 = 0; i2 < animation.length; i2++) {
      const state = flattenChannelStates(
        ...all.map((o) => o.state({})),
        hex[i % 5].state({ master: animation[i2], ...color }),
      );
      steps.push(state);
    }
  }

  return steps;
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

const masterStates: Array<number[]> = [];
for (let i = 0; i < 16; i++) {
  masterStates.push(
    new Array(300).fill(null).map((o) => (Math.random() < 0.1 ? 255 : 0)),
  );
}

const createPixelPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): Array<number[]> => {
  const { neopixelA, neopixelB } = devices.object();

  const steps: Array<number[]> = [];

  const masterSteps: Array<number[]> = [];
  for (let i = 0; i < masterStates.length; i++) {
    const from = masterStates[i];
    const to =
      i === masterStates.length - 1 ? masterStates[0] : masterStates[i + 1];

    for (let j = 0; j < 32; j++) {
      const state = new Array(from.length).fill(null);
      for (let k = 0; k < from.length; k++) {
        state[k] = Math.floor(from[k] + ((to[k] - from[k]) * j) / 32);
      }
      masterSteps.push(state);
    }
  }

  for (let i = 0; i < masterSteps.length; i++) {
    const color = i > masterSteps.length / 2 ? colors.a : colors.b;

    const state = [
      ...neopixelA.setMultiple(
        masterSteps[i]
          .slice(0, 150)
          .map((o, i) => ({ index: i, values: { master: o, ...color } })),
      ),
      ...neopixelB.setMultiple(
        masterSteps[i]
          .slice(150, 300)
          .map((o, i) => ({ index: i, values: { master: o, ...color } })),
      ),
    ];

    steps.push(state);
  }

  return steps;
};
