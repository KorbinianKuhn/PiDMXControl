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

export const createChaseWild = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.WILD, color);
  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  // const ball = createBallPattern(devices, colors);
  const head = createHeadPattern(devices, colors);
  const beamer = repeat(createBeamerPattern(devices, colors), 2);

  const steps = mergeDevicePatterns(bar, hex, head, beamer);

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

  // Left
  for (const color of [colors.a, colors.b]) {
    for (let i = 0; i < 8; i++) {
      steps.push(flattenChannelStates(off, a.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, c.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, e.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, d.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, b.state({ master: 255, ...color })));
      steps.push(off);
      steps.push(off);
      steps.push(off);
    }
  }

  // Right
  for (const color of [colors.a, colors.b]) {
    for (let i = 0; i < 8; i++) {
      steps.push(flattenChannelStates(off, b.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, d.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, e.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, c.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, a.state({ master: 255, ...color })));
      steps.push(off);
      steps.push(off);
      steps.push(off);
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

  const off = bar.state({ segments: 'all', master: 0 });

  // Left
  for (const color of [colors.a, colors.b]) {
    steps.push(
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    );
    steps.push(
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    );
    steps.push(
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    );
    steps.push(
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    );
    steps.push(off);
    steps.push(off);
    steps.push(off);
    steps.push(off);

    for (let i = 0; i < 7; i++) {
      steps.push(off);
      steps.push(off);
      steps.push(off);
      steps.push(off);
      steps.push(off);
      steps.push(bar.state({ segments: [6, 7], master: 255, ...color }));
      steps.push(bar.state({ segments: [3, 4], master: 255, ...color }));
      steps.push(bar.state({ segments: [0, 1], master: 255, ...color }));
    }
  }

  // Right
  for (const color of [colors.a, colors.b]) {
    steps.push(
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    );
    steps.push(
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    );
    steps.push(
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    );
    steps.push(
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    );
    steps.push(off);
    steps.push(off);
    steps.push(off);
    steps.push(off);

    for (let i = 0; i < 7; i++) {
      steps.push(off);
      steps.push(off);
      steps.push(off);
      steps.push(off);
      steps.push(off);
      steps.push(bar.state({ segments: [0, 1], master: 255, ...color }));
      steps.push(bar.state({ segments: [3, 4], master: 255, ...color }));
      steps.push(bar.state({ segments: [6, 7], master: 255, ...color }));
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

  for (const color of [colors.a, colors.b]) {
    for (let i = 0; i < 8; i++) {
      steps.push(
        flattenChannelStates(
          spot.state({ master: 255, ...color, strobe: 20 }),
          dome.state({ master: 255, ...color, strobe: 20 }),
        ),
      );
    }
    for (let i = 0; i < 24; i++) {
      steps.push(flattenChannelStates(spot.state({}), dome.state({})));
    }
  }

  return repeat(steps, 8);
};

const createHeadPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { left, right } = devices.object().head;

  for (let i = 0; i < 64; i++) {
    steps.push(
      flattenChannelStates(
        left.state({ master: 0, w: 255, strobe: 40 }),
        right.state({ master: 255, w: 255, strobe: 40 }),
      ),
    );
    steps.push(
      flattenChannelStates(
        left.state({ master: 255, w: 255, strobe: 40 }),
        right.state({ master: 0, w: 255, strobe: 40 }),
      ),
    );
  }

  return warp(steps, 2);
};

const createBeamerPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const beamer = devices.object().beamer;
  const a = beamer.state({ master: 255, ...colors.a });
  const b = beamer.state({ master: 255, ...colors.b });

  for (const color of [a, b]) {
    for (let i = 0; i < 64; i++) {
      steps.push(color);
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

  for (const color of [colors.a, colors.b, colors.a, colors.b]) {
    for (let i = 0; i < 8; i++) {
      for (let i2 = 0; i2 < 16; i2++) {
        const index = Math.round(i2 * (neopixelA.length / 16));
        steps.push([
          ...neopixelA.setPixel(index, { ...color }),
          ...neopixelB.setPixel(index, {}),
        ]);
      }

      for (let i2 = 0; i2 < 16; i2++) {
        const index = Math.round(i2 * (neopixelA.length / 16));
        steps.push([
          ...neopixelA.setPixel(index, {}),
          ...neopixelB.setPixel(index, { ...color }),
        ]);
      }
    }
  }

  return steps;
};
