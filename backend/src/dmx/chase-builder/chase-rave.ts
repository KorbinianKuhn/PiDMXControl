import { VarytecGigabarHex } from '../devices/varytec-gigabar-hex';
import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
} from './chase-utils';

export const createChaseRave = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.RAVE, true, color);
  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  const head = createHeadPattern(devices, colors);
  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(head, bar, hex, beamer);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationWatching(steps.length));

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

  const w = bar.state({ segments: 'all', master: 255, w: 255, strobe: 20 });

  for (let i = 0; i < 128; i++) {
    steps.push(w);
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

  let selected: VarytecGigabarHex;
  const getRandomHex = () => {
    const randomHex = hex[Math.floor(Math.random() * 5)];
    if (randomHex === selected) {
      return getRandomHex();
    }
    return randomHex;
  };

  for (const color of [colors.a, colors.b]) {
    for (let i = 0; i < 16; i++) {
      selected = getRandomHex();
      const state = selected.state({ master: 255, ...color, strobe: 200 });
      steps.push(state);
      for (let j = 0; j < 3; j++) {
        steps.push([]);
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

  for (let state of [a, b]) {
    for (let j = 0; j < 4; j++) {
      steps.push(state);
    }
    for (let j = 0; j < 60; j++) {
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

  for (let color of [colors.a, colors.b]) {
    for (let j = 0; j < 64; j++) {
      steps.push(beamer.state({ master: 255, ...color }));
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

  for (const color of [colors.a, colors.a, colors.b, colors.b]) {
    for (let j = 0; j < 64; j++) {
      steps.push(off);
    }

    const length = neopixelA.length;
    const third = length / 3;

    const value = { master: 255, ...color };

    const one = [
      ...neopixelA.setRange(0, third, value),
      ...neopixelB.setRange(0, third, value),
    ];
    const two = [
      ...neopixelA.setRange(third, third * 2, value),
      ...neopixelB.setRange(third, third * 2, value),
    ];
    const three = [
      ...neopixelA.setRange(third * 2, length, value),
      ...neopixelB.setRange(third * 2, length, value),
    ];

    for (const state of [one, two, three]) {
      for (let j = 0; j < 4; j++) {
        steps.push([...state]);
      }
    }

    for (let j = 0; j < 52; j++) {
      steps.push(off);
    }
  }

  return steps;
};
