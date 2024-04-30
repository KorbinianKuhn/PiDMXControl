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

  // chase.addPixelSteps(createPixelPattern(devices, colors));

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

const createPixelPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): Array<number[]> => {
  const { neopixelA, neopixelB } = devices.object();

  const steps: Array<number[]> = [];

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  for (const color of [colors.a, colors.b]) {
    const a = [];
    for (let i = 0; i < 4; i++) {
      a.push(
        new Array(neopixelA.length).fill(null).map((o, i) => {
          return {
            index: i,
            values:
              Math.random() > 0.2
                ? {
                    ...color,
                    master: 0,
                  }
                : {
                    ...color,
                    master: randomInt(0, 128),
                  },
          };
        }),
      );
    }

    const states = [];
    for (let i = 0; i < 3; i++) {
      const from = a[i];
      const to = a[i + 1];

      for (let i2 = 0; i < 4; i2++) {
        const state = new Array(neopixelA.length).fill(null);
        for (let j = 0; j < from.length; j++) {
          // const master = Math.floor(
          //   from[j].values.master +
          //     ((to[j].values.master - from[j].values.master) * i2) / 8,
          // );
          state[j] = {
            index: j,
            values: {
              ...from[j].values,
              master: 0,
            },
          };
        }
        states.push(state);
      }
    }

    for (const state of states) {
      steps.push(neopixelA.setMultiple(state));
    }
  }

  return steps;
};
