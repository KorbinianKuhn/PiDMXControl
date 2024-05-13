import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  getPixelGradient,
  mergeDevicePatterns,
} from './chase-utils';

export const createChaseLate = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.LATE, true, color);
  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  const head = createHeadPattern(devices, colors);
  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(bar, hex, head, beamer);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationNodding(steps.length));

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

  const w = bar.state({ segments: 'all', master: 255, w: 255, strobe: 220 });
  const a = bar.state({
    segments: 'all',
    master: 255,
    ...colors.a,
    strobe: 220,
  });
  const b = bar.state({
    segments: 'all',
    master: 255,
    ...colors.b,
    strobe: 220,
  });
  const off = bar.state({ segments: 'all' });

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 8; j++) {
      steps.push(w);
    }
    for (let j = 0; j < 56; j++) {
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

  const off = flattenChannelStates(...all.map((o) => o.state({})));

  for (let i = 0; i < 2; i++) {
    for (let color of [{ w: 255 }, colors.a, { w: 255 }, colors.b]) {
      for (let j = 0; j < 8; j++) {
        steps.push(off);
      }
      steps.push(flattenChannelStates(off, a.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, b.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, c.state({ master: 255, ...color })));
      steps.push(flattenChannelStates(off, d.state({ master: 255, ...color })));
      for (let j = 0; j < 4; j++) {
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
    ...head.all.map((o) => o.state({ master: 255, ...colors.a, strobe: 240 })),
  );
  const b = flattenChannelStates(
    ...head.all.map((o) => o.state({ master: 255, ...colors.b, strobe: 240 })),
  );
  const w = flattenChannelStates(
    ...head.all.map((o) => o.state({ master: 255, w: 255, strobe: 240 })),
  );

  for (let state of [a, w, b, w]) {
    for (let j = 0; j < 16; j++) {
      steps.push(off);
    }
    for (let j = 0; j < 4; j++) {
      steps.push(state);
    }
    for (let j = 0; j < 12; j++) {
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

  for (let i = 0; i < 8; i++) {
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

  for (let i = 0; i < 2; i++) {
    for (const color of [colors.a, { w: 255 }, colors.b, { w: 255 }]) {
      const a = getPixelGradient(neopixelA, color, 16, 32);
      const b = getPixelGradient(neopixelB, color, 16, 32);

      for (let j = 0; j < 32; j++) {
        steps.push([...a[j], ...b[j]]);
      }

      for (let j = 0; j < 32; j++) {
        steps.push(off);
      }
    }
  }

  return steps;
};
