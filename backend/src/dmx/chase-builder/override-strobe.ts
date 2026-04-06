import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceStateValues } from '../lib/device';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import {
  flattenChannelStates,
  getChaseColorValues,
  getDomeColorValue,
  mergeDevicePatterns,
} from './chase-utils';

export const createChaseStrobeStorm = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_STORM, true, color);

  const colors = getChaseColorValues(color);

  const { bar, head, dome, spot, beamer, hex } = devices.object();

  const steps: ChannelAnimation = [];

  for (const color of [colors.a, colors.b]) {
    for (let i = 0; i < 5; i++) {
      const state = flattenChannelStates(
        ...hex.all.map((o, i2) =>
          i2 === i
            ? o.state({ master: 255, w: 255 })
            : o.state({ master: 0, w: 0 }),
        ),
        bar.state({ segments: 'all', master: 255, w: 255, strobe: 250 }),
        ...head.all.map((o) => o.state({ master: 255, ...color, strobe: 250 })),
        dome.state({
          master: 255,
          ...getDomeColorValue(color),
          strobe: 250,
          movement: 127,
        }),
        spot.state({ master: 255, ...color, strobe: 250 }),
        beamer.state({ master: 255, ...color, strobe: 120 }),
      );

      steps.push(state);
    }
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationWatching(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  return chase;
};

export const createChaseStrobeFlash = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_FLASH, false, color);

  const steps: Array<number[]> = [];

  const colors = getChaseColorValues(color);

  const { neopixelA, neopixelB } = devices.object();

  const getRandomMasterValues = () =>
    Array.from({ length: 15 }, () => (Math.random() < 0.05 ? 255 : 0));

  const getRandomStrobeValues = (color: DeviceStateValues) => {
    const master = getRandomMasterValues();
    const values = [];

    for (let i = 0; i < master.length; i++) {
      values.push(
        ...Array.from({ length: 10 }, (_, i2) => ({
          index: i * 10 + i2,
          values: { ...color, master: master[i] },
        })),
      );
    }

    return values;
  };

  for (let i = 0; i < 64; i++) {
    const state = [
      ...neopixelA.setMultiple(getRandomStrobeValues(colors.a)),
      ...neopixelB.setMultiple(getRandomStrobeValues(colors.a)),
    ];
    steps.push(state, state);
  }

  chase.addSteps(new Array(steps.length / 4).fill(null).map(() => []));
  chase.addPixelSteps(steps);

  return chase;
};

export const createChaseStrobeSlowmo = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_SLOWMO, true);

  const steps: ChannelAnimation = [];

  const { bar, head } = devices.object();

  const state = flattenChannelStates(
    bar.state({ segments: 'all', master: 255, w: 255, strobe: 120 }),
    ...head.all.map((o) => o.state({ master: 255, w: 255, strobe: 100 })),
  );

  for (let i = 0; i < 32; i++) {
    steps.push(state);
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationFront(steps.length));

  const merged = mergeDevicePatterns(steps, ...animations);

  chase.addSteps(merged);

  return chase;
};

export const createChaseStrobeColor = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_COLOR, true, color);
  const colors = getChaseColorValues(color);
  const steps: ChannelAnimation = [];

  const { bar, head } = devices.object();

  const a = flattenChannelStates(
    ...head.all.map((o) => o.state({ master: 255, ...colors.a, strobe: 180 })),
    bar.state({ segments: 'all', master: 255, ...colors.a, strobe: 240 }),
  );

  const b = flattenChannelStates(
    ...head.all.map((o) => o.state({ master: 255, ...colors.b, strobe: 180 })),
    bar.state({ segments: 'all', master: 255, ...colors.b, strobe: 240 }),
  );

  for (let color of [a, b, a, b]) {
    for (let i = 0; i < 8; i++) {
      steps.push(color);
    }
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationFront(steps.length));

  const merged = mergeDevicePatterns(steps, ...animations);

  chase.addSteps(merged);

  return chase;
};

export const createChaseStrobeWhite = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_WHITE, true);

  const steps: ChannelAnimation = [];

  const { bar, head } = devices.object();

  const state = flattenChannelStates(
    bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    ...head.all.map((o) => o.state({ master: 255, w: 255, strobe: 200 })),
  );

  for (let i = 0; i < 32; i++) {
    steps.push(state);
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationFront(steps.length));

  const merged = mergeDevicePatterns(steps, ...animations);

  chase.addSteps(merged);

  return chase;
};

export const createChaseStrobePixels = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_PIXELS, false, color);

  const colors = getChaseColorValues(color);

  const { neopixelA, neopixelB } = devices.object();

  const steps: Array<number[]> = [];

  for (let i = 0; i < 8; i++) {
    for (let color of [colors.a, colors.b]) {
      steps.push([
        ...neopixelA.setAll({ ...color, master: 255 }),
        ...neopixelB.setAll({ ...color, master: 255 }),
      ]);
      steps.push([
        ...neopixelA.setAll({ ...color, master: 255 }),
        ...neopixelB.setAll({ ...color, master: 255 }),
      ]);
      steps.push([...neopixelA.empty(), ...neopixelB.empty()]);
      steps.push([...neopixelA.empty(), ...neopixelB.empty()]);
      steps.push([...neopixelA.empty(), ...neopixelB.empty()]);
      steps.push([...neopixelA.empty(), ...neopixelB.empty()]);
      steps.push([...neopixelA.empty(), ...neopixelB.empty()]);
      steps.push([...neopixelA.empty(), ...neopixelB.empty()]);
    }
  }

  chase.addSteps(new Array(steps.length / 4).fill(null).map(() => []));

  chase.addPixelSteps(steps);

  return chase;
};

export const createChaseStrobeShort = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_SHORT, false);

  const steps: ChannelAnimation = [];

  const { bar, head } = devices.object();

  const state = flattenChannelStates(
    bar.state({ segments: 'all', master: 255, w: 255, strobe: 240 }),
    ...head.all.map((o) => o.state({ master: 255, w: 255, strobe: 220 })),
  );

  for (let i = 0; i < 16; i++) {
    steps.push(state);
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationFront(steps.length));

  const merged = mergeDevicePatterns(steps, ...animations);

  chase.addSteps(merged);

  return chase;
};

export const createChaseStrobeDots = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_DOTS, true);

  const steps: ChannelAnimation = [];

  const { bar } = devices.object();

  const indexes = new Array(8).fill(0).map((_, i) => i);

  for (let i = 0; i < 32; i++) {
    const index = indexes[Math.floor(Math.random() * indexes.length)];
    const state = bar.state({
      segments: index,
      master: 255,
      w: 255,
    });

    steps.push(state);
    steps.push([]);
  }

  chase.addSteps(steps);

  return chase;
};

export const createChaseStrobeFlat = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_FLAT, true);

  const steps: ChannelAnimation = [];

  const { head } = devices.object();

  const state = flattenChannelStates(
    ...head.all.map((o) =>
      o.state({
        master: 255,
        w: 255,
        strobe: 240,
      }),
    ),
  );
  for (let i = 0; i < 32; i++) {
    steps.push(state);
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationFront(steps.length));

  const merged = mergeDevicePatterns(steps, ...animations);

  chase.addSteps(merged);

  return chase;
};
