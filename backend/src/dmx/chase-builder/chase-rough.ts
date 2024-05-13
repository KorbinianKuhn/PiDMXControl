import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
} from './chase-utils';

export const createChaseRough = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.ROUGH, true, color);
  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  const head = createHeadPattern(devices, colors);
  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(bar, hex, head, beamer);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(steps.length));

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

  const strobe = bar.state({
    segments: 'all',
    master: 255,
    w: 255,
    strobe: 220,
  });
  const off = bar.state({ segments: 'all' });

  for (let j = 0; j < 8; j++) {
    steps.push(strobe);
  }
  for (let j = 0; j < 56; j++) {
    steps.push(off);
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      steps.push(strobe);
    }
    for (let j = 0; j < 60; j++) {
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

  const off = flattenChannelStates(
    ...all.map((hex) => hex.state({ master: 0 })),
  );

  for (let i = 0; i < 4; i++) {
    for (let color of [colors.a, colors.b]) {
      for (let j = 0; j < 14; j++) {
        steps.push(off);
      }

      steps.push(
        flattenChannelStates(
          a.state({ master: 255, ...color }),
          b.state({ master: 255, ...color }),
        ),
      );
      steps.push(
        flattenChannelStates(
          c.state({ master: 255, ...color }),
          d.state({ master: 255, ...color }),
        ),
      );
      steps.push(e.state({ master: 255, ...color }));

      for (let j = 0; j < 15; j++) {
        steps.push(off);
      }
    }
  }

  return steps;
};

const createHeadPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const head = devices.object().head;

  const off = flattenChannelStates(...head.all.map((o) => o.state({})));
  const a = flattenChannelStates(
    ...head.all.map((o) => o.state({ master: 255, ...colors.a, strobe: 200 })),
  );
  const b = flattenChannelStates(
    ...head.all.map((o) => o.state({ master: 255, ...colors.b, strobe: 200 })),
  );

  for (let state of [a, b, a, b]) {
    for (let j = 0; j < 32; j++) {
      steps.push(off);
    }
    for (let j = 0; j < 8; j++) {
      steps.push(state);
    }
    for (let j = 0; j < 24; j++) {
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

  for (let i = 0; i < 16; i++) {
    for (let color of [colors.a, colors.b]) {
      for (let j = 0; j < 8; j++) {
        steps.push(beamer.state({ master: 255, ...color }));
      }
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
  const a = [...neopixelA.setAll(colors.a), ...neopixelB.setAll(colors.a)];
  const b = [...neopixelA.setAll(colors.b), ...neopixelB.setAll(colors.b)];

  for (let i = 0; i < 16; i++) {
    for (const state of [a, b]) {
      for (let j = 0; j < 4; j++) {
        steps.push(state);
      }
      for (let j = 0; j < 28; j++) {
        steps.push(off);
      }
    }
  }

  return steps;
};
