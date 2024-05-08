import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
  repeat,
  warp,
} from './chase-utils';

export const createChaseDark = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.DARK, color);
  const colors = getChaseColorValues(color);

  // const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  const head = createHeadPattern(devices, colors);
  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(hex, head, beamer);

  const warped = warp(steps, 1);

  const animations = devices
    .object()
    .head.all.map((o) => repeat(o.animationNodding(steps.length / 8), 8));

  chase.addSteps(mergeDevicePatterns(warped, ...animations));

  chase.addPixelSteps(createPixelPattern(devices, colors));

  return chase;
};

const createHexPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { a, b, c, d, e, all } = devices.object().hex;

  const off = flattenChannelStates(
    ...all.map((hex) => hex.state({ master: 0 })),
  );

  for (let i = 0; i < 4; i++) {
    for (const color of [colors.a, { w: 255 }, colors.b, { w: 255 }]) {
      for (let i2 = 0; i2 < 8; i2++) {
        steps.push(off);
      }

      steps.push(
        flattenChannelStates(
          off,
          ...all.map((hex) => hex.state({ master: 255, ...color })),
        ),
      );

      for (let i2 = 0; i2 < 7; i2++) {
        steps.push(off);
      }
    }
  }

  return steps;
};

const createBarPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const bar = devices.object().bar;

  const fadeInSteps = 2;
  const fadeOutSteps = 14;
  const maxBrightness = 255;

  for (let i = 0; i < fadeInSteps; i++) {
    const brightnessStep = Math.round(maxBrightness / fadeInSteps);

    const master = i * brightnessStep;

    steps.push(bar.state({ segments: 'all', master, ...colors.a }));
  }

  for (let i = 0; i < fadeOutSteps; i++) {
    const brightnessStep = Math.round(maxBrightness / fadeOutSteps);

    const master = maxBrightness - brightnessStep * i;

    steps.push(bar.state({ segments: 'all', master, ...colors.a }));
  }

  return repeat(steps, 16);
};

const createHeadPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { left, right } = devices.object().head;

  const masterBrightness = 200;
  const strobeDuration = 8;
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

  return repeat(steps, 2);
};

const createBeamerPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const beamer = devices.object().beamer;

  for (const color of [colors.a, colors.b]) {
    for (let i = 0; i < 32; i++) {
      steps.push(beamer.state({ master: 255, ...color }));
      steps.push(beamer.state({ master: 205, ...color }));
      steps.push(beamer.state({ master: 155, ...color }));
      steps.push(beamer.state({ master: 105, ...color }));
    }
  }

  return steps;
};

const createPixelPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): Array<number[]> => {
  const { neopixelA, neopixelB } = devices.object();

  let steps: Array<number[]> = [];

  const off = [...neopixelA.setAll({}), ...neopixelB.setAll({})];

  for (let i = 0; i < 2; i++) {
    for (const color of [colors.a, colors.b]) {
      for (let i2 = 0; i2 < 2; i2++) {
        for (let i3 = 0; i3 < 16; i3++) {
          const index = Math.round(i3 * (neopixelA.length / 16));
          steps.push([
            ...neopixelA.setPixel(index, { ...color }),
            ...neopixelB.setPixel(index, { ...color }),
          ]);
        }
        for (let i2 = 0; i2 < 16; i2++) {
          steps.push(off);
        }
      }
    }
  }

  steps = steps.slice(0, -32);

  const a = [
    ...neopixelA.setAll({ ...colors.a }),
    ...neopixelB.setAll({ ...colors.a }),
  ];
  const b = [
    ...neopixelA.setAll({ ...colors.b }),
    ...neopixelB.setAll({ ...colors.b }),
  ];
  const w = [...neopixelA.setAll({ w: 255 }), ...neopixelB.setAll({ w: 255 })];

  steps.push(a, a, off, off, off, off, off, off);
  steps.push(b, b, off, off, off, off, off, off);
  steps.push(w, w, off, off, w, w, off, off);
  steps.push(off, off, off, off, off, off, off, off);

  return [...steps, ...steps, ...steps, ...steps];
};
