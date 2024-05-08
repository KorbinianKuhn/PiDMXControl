import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import {
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
  repeat,
} from './chase-utils';

const getBuildupSteps = (
  length: number,
  devices: DeviceRegistry,
  color: ChaseColor,
): ChannelAnimation => {
  const colors = getChaseColorValues(color);

  const { bar, hex, dome, spot } = devices.object();

  const steps: ChannelAnimation = [];

  for (let i = 0; i < 8; i++) {
    for (const color of [colors.a, colors.b]) {
      steps.push(
        flattenChannelStates(
          ...hex.all.map((o) => o.state({ master: 255, ...color })),
          dome.state({ master: 255, ...color }),
          spot.state({ master: 255, ...color }),
        ),
      );
      for (let i2 = 0; i2 < 7; i2++) {
        steps.push(
          flattenChannelStates(
            ...hex.all.map((o) => o.state({ master: 0, ...color })),
            dome.state({ master: 255, ...color }),
            spot.state({ master: 255, ...color }),
          ),
        );
      }
    }
  }

  // Fadeout
  for (let i = 16; i > 0; i--) {
    const master = (255 / 16) * i;
    steps.push(
      flattenChannelStates(
        ...hex.all.map((o) => o.state({ master, ...colors.a })),
      ),
    );
  }

  // Strobe
  for (const color of [{ w: 255 }, colors.a, { w: 255 }, colors.b]) {
    for (let i = 0; i < 4; i++) {
      const state = bar.state({
        segments: 'all',
        master: 255,
        ...color,
        strobe: 240,
      });
      steps.push(state);
    }
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(steps.length));

  const merged = mergeDevicePatterns(steps, ...animations);

  return merged.slice(merged.length - 16 - length);
};

export const createChaseBuildupInfinite = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_INFINITE, color);

  const colors = getChaseColorValues(color);

  const { neopixelA, neopixelB } = devices.object();

  const steps: Array<number[]> = [];

  for (const color of [colors.a, colors.b]) {
    let indexes = [];

    const offset = color === colors.a ? 0 : 12;

    for (let i = 0; i < neopixelA.length; i++) {
      if (i % 25 === 0) {
        const index = i + offset;
        indexes.push(index, index + 1, index + 2, index + 3, index + 4);
      }
    }

    indexes = indexes.filter((o) => o < neopixelA.length);

    const state = indexes.map((o) => ({
      index: o,
      values: { master: 255, ...color },
    }));

    const off = [...neopixelA.empty(), ...neopixelB.empty()];
    const on = [
      ...neopixelA.setMultiple(state),
      ...neopixelB.setMultiple(state),
    ];

    steps.push(...new Array(32).fill(null).map((o, i) => (i < 4 ? on : off)));
  }

  chase.addSteps(new Array(steps.length / 4).fill(null).map(() => []));

  chase.addPixelSteps(steps);

  return chase;
};

export const createChaseBuildupBright = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_BRIGHT, color);
  const colors = getChaseColorValues(color);
  const steps: ChannelAnimation = [];

  const on = flattenChannelStates(
    devices.object().bar.state({ segments: 'all', master: 255, ...colors.a }),
    ...devices
      .object()
      .head.all.map((o) => o.state({ master: 255, ...colors.a })),
    ...devices
      .object()
      .hex.all.map((o) => o.state({ master: 255, ...colors.a })),
  );

  for (let i = 0; i < 16; i++) {
    steps.push(on);
  }

  for (let i = 0; i < 16; i++) {
    steps.push([]);
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationFront(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  const { neopixelA, neopixelB } = devices.object();
  const pixelSteps = [];
  const off = [...neopixelA.clear(), ...neopixelB.clear()];
  const left = [
    ...neopixelA.setAll({ ...colors.a, master: 255 }),
    ...neopixelB.setAll({ ...colors.a, master: 0 }),
  ];
  const right = [
    ...neopixelA.setAll({ ...colors.a, master: 0 }),
    ...neopixelB.setAll({ ...colors.a, master: 255 }),
  ];
  for (let i = 0; i < 64; i++) {
    pixelSteps.push(off);
  }
  for (let i = 0; i < 8; i++) {
    pixelSteps.push(left, left, off, off);
    pixelSteps.push(right, right, off, off);
  }
  chase.addPixelSteps(pixelSteps);

  return chase;
};

export const createChaseBuildupFadeout = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_FADEOUT, color);

  const steps = getBuildupSteps(8, devices, color);

  chase.addSteps(steps);

  return chase;
};

export const createChaseBuildupBlinder = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_BLINDER, color);

  const colors = getChaseColorValues(color);

  let steps: ChannelAnimation = [];

  for (let i = 0; i < 4; i++) {
    const master = i * 255;
    steps.push(
      flattenChannelStates(
        devices.object().bar.state({ segments: 'all', master, ...colors.a }),
        ...devices
          .object()
          .head.all.map((o) => o.state({ master, ...colors.a })),
      ),
    );
  }

  steps = repeat(steps, 8);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationFront(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  return chase;
};
