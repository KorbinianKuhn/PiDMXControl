import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  getPixelGradient,
  mergeDevicePatterns,
  repeat,
} from './chase-utils';

export const createChaseMagic = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.MAGIC, true, color);
  const colors = getChaseColorValues(color);

  const hex = createHexPattern(devices, colors);
  // const ball = warp(createBallPattern(devices, colors), 4);
  const head = createHeadPattern(devices, colors);
  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(hex, head, beamer);

  const animations = devices
    .object()
    .head.all.map((o) => repeat(o.animationNodding(steps.length / 2), 2));

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

const createHeadPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { left, right } = devices.object().head;

  const masterBrightness = 255;
  const strobeDuration = 16;
  const breakDuration = 32 - strobeDuration;

  for (const color of [colors.b, colors.a]) {
    for (let i = 0; i < strobeDuration; i++) {
      steps.push(
        flattenChannelStates(
          left.state({ master: masterBrightness, ...color }),
          right.state({ master: 0 }),
        ),
      );
    }

    for (let i = 0; i < breakDuration; i++) {
      steps.push(
        flattenChannelStates(
          left.state({ master: 0 }),
          right.state({ master: 0 }),
        ),
      );
    }

    for (let i = 0; i < strobeDuration; i++) {
      steps.push(
        flattenChannelStates(
          left.state({ master: 0 }),
          right.state({ master: masterBrightness, ...color }),
        ),
      );
    }

    for (let i = 0; i < breakDuration; i++) {
      steps.push(
        flattenChannelStates(
          left.state({ master: 0 }),
          right.state({ master: 0 }),
        ),
      );
    }
  }

  return steps;
};

const createPixelPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): Array<number[]> => {
  const { neopixelA, neopixelB } = devices.object();

  const steps: Array<number[]> = [];

  // for (const color of [colors.a, colors.b, colors.a]) {
  //   const gradient = Array.from({ length: 32 }, (_, i) => ({
  //     ...color,
  //     master: Math.floor((i * 255) / 32),
  //   }));

  //   const a = new Array(neopixelA.length)
  //     .fill({})
  //     .map((o, i) => ({ index: i, values: {} }));

  //   const b = new Array(neopixelB.length)
  //     .fill({})
  //     .map((o, i) => ({ index: i, values: {} }));

  //   for (let i = 0; i < gradient.length; i++) {
  //     a[i].values = { ...gradient[i] };
  //     b[i].values = { ...gradient[i] };
  //   }

  //   shiftPixels(b, 64);

  //   for (let i = 0; i < 150; i++) {
  //     steps.push([...neopixelA.setMultiple(a), ...neopixelB.setMultiple(b)]);
  //     shiftPixels(a, 2);
  //     shiftPixels(b, 2);
  //   }
  // }

  // const off = [...neopixelA.setAll({}), ...neopixelB.setAll({})];

  // for (let i = 0; i < 62; i++) {
  //   steps.push(off);
  // }

  for (const color of [colors.a, colors.b]) {
    for (let i = 0; i < 4; i++) {
      const a = getPixelGradient(neopixelA, color, 32, 64);
      const b = getPixelGradient(neopixelB, color, 32, 64, 64);
      for (let j = 0; j < a.length; j++) {
        steps.push([...a[j], ...b[j]]);
      }
    }
  }

  return steps;
};
