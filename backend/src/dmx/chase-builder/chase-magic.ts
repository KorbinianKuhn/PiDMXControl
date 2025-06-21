import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  getDomeColorValue,
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

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  const ball = createBallPattern(devices, colors);
  const head = createHeadPattern(devices, colors);
  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(bar, hex, head, beamer, ball);

  const animations = devices
    .object()
    .head.all.map((o) => repeat(o.animationNodding(steps.length / 2), 2));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  chase.addPixelSteps(createPixelPattern(devices, colors));

  return chase;
};

const createBarPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const bar = devices.object().bar;
  const off = bar.state({ segments: 'all' });

  const brightness = new Array(4).fill(0).map((o, i) => (255 / 4) * (i + 1));
  brightness.push(...brightness.slice().reverse());

  for (const color of [colors.a, colors.b, colors.a, colors.b]) {
    for (const master of brightness) {
      steps.push(bar.state({ segments: 'all', master, ...color }));
    }
    for (let j = 0; j < 24; j++) {
      steps.push(off);
    }
  }

  return steps;
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

  const off = flattenChannelStates(
    dome.state({ master: 0, movement: 127 }),
    spot.state({ master: 0 }),
  );

  const a = flattenChannelStates(
    dome.state({
      master: 255,
      ...getDomeColorValue(colors.a),
      movement: 127,
    }),
    spot.state({ master: 255, ...colors.a }),
  );
  const b = flattenChannelStates(
    dome.state({
      master: 255,
      ...getDomeColorValue(colors.b),
      movement: 127,
    }),
    spot.state({ master: 255, ...colors.b }),
  );

  for (const color of [a, b]) {
    for (let j = 0; j < 32; j++) {
      steps.push(off);
    }
    for (let j = 0; j < 16; j++) {
      steps.push(color);
    }
    for (let j = 0; j < 16; j++) {
      steps.push(off);
    }
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
