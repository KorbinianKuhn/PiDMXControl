import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceStateValues } from '../lib/device';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
  repeat,
  warp,
} from './chase-utils';

export const createChaseDisco = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.DISCO, color);

  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  const ball = createBallPattern(devices, colors);
  const head = createHeadPattern(devices, colors);

  const steps = mergeDevicePatterns(hex, bar, ball, head);

  const warped = warp(steps, 2);

  const animations = devices
    .object()
    .head.all.map((o) => repeat(o.animationNodding(warped.length / 8), 8));

  chase.addSteps(mergeDevicePatterns(warped, ...animations));

  return chase;
};

const createBarPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { bar } = devices.object();

  const off = bar.state({ segments: 'all' });
  const green = bar.state({
    segments: 'all',
    master: 255,
    g: 255,
    strobe: 240,
  });
  const pink = bar.state({
    segments: 'all',
    master: 255,
    r: 255,
    b: 255,
    strobe: 240,
  });
  const yellow = bar.state({
    segments: 'all',
    master: 255,
    r: 255,
    g: 255,
    strobe: 240,
  });
  const cyan = bar.state({
    segments: 'all',
    master: 255,
    g: 255,
    b: 255,
    strobe: 240,
  });

  for (let i = 0; i < 4; i++) {
    for (const color of [green, pink, yellow, cyan]) {
      steps.push(color);
      steps.push(color);
      steps.push(off);
      steps.push(off);
      steps.push(off);
      steps.push(off);
      steps.push(off);
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

  const { all, a, b, c, d, e } = devices.object().hex;

  const green: DeviceStateValues = { master: 255, g: 255 };
  const pink: DeviceStateValues = { master: 255, r: 255, b: 255 };
  const yellow: DeviceStateValues = { master: 255, r: 255, g: 255 };
  const cyan: DeviceStateValues = { master: 255, g: 255, b: 255 };

  const colorStates = [green, yellow, pink, cyan];

  let randomHex = [];
  let randomColors = [];
  for (let i = 0; i < 128; i++) {
    if (randomHex.length === 0) {
      randomHex = [...all].sort(() => (Math.random() < 0.5 ? 1 : -1));
    }
    if (randomColors.length === 0) {
      randomColors = [...colorStates].sort(() =>
        Math.random() < 0.5 ? 1 : -1,
      );
    }

    const hex = randomHex.shift();
    const color = randomColors.shift();

    const state = flattenChannelStates(
      ...all.map((o) => (o === hex ? o.state(color) : o.state({}))),
    );
    steps.push(state);
  }

  return steps;
};

const createBallPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { dome, spot } = devices.object();

  const green: DeviceStateValues = { master: 255, g: 255 };
  const pink: DeviceStateValues = { master: 255, r: 255, b: 255 };
  const yellow: DeviceStateValues = { master: 255, r: 255, g: 255 };
  const cyan: DeviceStateValues = { master: 255, g: 255, b: 255 };

  const colorStates = [green, yellow, pink, cyan];

  for (let i = 0; i < 2; i++) {
    for (const color of colorStates) {
      const on = flattenChannelStates(
        dome.state({ ...color, movement: 127 }),
        spot.state({ ...color }),
      );
      const off = flattenChannelStates(
        dome.state({ movement: 127 }),
        spot.state({}),
      );
      for (let i2 = 0; i2 < 4; i2++) {
        steps.push(on, off);
      }
    }
  }

  return warp(steps, 2);
};

const createHeadPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { left, right } = devices.object().head;

  const green: DeviceStateValues = { master: 255, g: 255, strobe: 30 };
  const pink: DeviceStateValues = { master: 255, r: 255, b: 255, strobe: 30 };
  const yellow: DeviceStateValues = {
    master: 255,
    r: 255,
    g: 255,
    strobe: 30,
  };
  const cyan: DeviceStateValues = { master: 255, g: 255, b: 255, strobe: 30 };

  const colorStatesLeft = [green, yellow, pink, cyan];
  const colorStatesRight = colorStatesLeft.slice().reverse();

  for (let i = 0; i < 16; i++) {
    for (let i2 = 0; i2 < 8; i2++) {
      steps.push(
        flattenChannelStates(
          left.state(i % 2 ? {} : colorStatesLeft[i2 % 4]),
          right.state(i % 2 ? colorStatesRight[i2 % 4] : {}),
        ),
      );
    }
  }

  return steps;
};
