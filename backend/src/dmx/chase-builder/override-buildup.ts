import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceStateValues } from '../lib/device';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import {
  flattenChannelStates,
  getChaseColorValues,
  getPixelGradient,
  mergeDevicePatterns,
  mergePixelPatterns,
} from './chase-utils';

export const createChaseBuildupFadeout = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_FADEOUT, false, color);
  const colors = getChaseColorValues(color);

  const { bar, hex, head, neopixelA, neopixelB } = devices.object();

  const steps: ChannelAnimation = [];

  // Fadeout
  for (let i = 8; i > 0; i--) {
    const master = (255 / 8) * i;
    steps.push(
      flattenChannelStates(
        ...head.all.map((o) => o.state({ master, ...colors.a })),
        ...hex.all.map((o) => o.state({ master, ...colors.a })),
        bar.state({
          segments: 'all',
          master,
          ...colors.a,
        }),
      ),
    );
  }

  for (let i = 8; i > 0; i--) {
    steps.push(
      flattenChannelStates(
        ...head.all.map((o) => o.state({ master: 0 })),
        ...hex.all.map((o) => o.state({ master: 0 })),
      ),
    );
  }

  // Strobe
  for (const color of [{ w: 255 }, colors.a, { w: 255 }, colors.b]) {
    for (let i = 0; i < 4; i++) {
      steps.push(
        flattenChannelStates(
          bar.state({
            segments: 'all',
            master: 255,
            ...color,
            strobe: 240,
          }),
          ...head.all.map((o) =>
            o.state({ master: 255, ...color, strobe: 240 }),
          ),
        ),
      );
    }
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationFront(steps.length));

  const merged = mergeDevicePatterns(steps, ...animations);

  chase.addSteps(merged);

  const pixelSteps: Array<number[]> = [];
  for (let i = 0; i < 64; i++) {
    pixelSteps.push([...neopixelA.clear(), ...neopixelB.clear()]);
  }

  const gradient = mergePixelPatterns(
    getPixelGradient(neopixelA, { master: 255, ...colors.a }, 8, 8),
    getPixelGradient(neopixelB, { master: 255, ...colors.a }, 8, 8),
  );
  for (let i = 0; i < 8; i++) {
    pixelSteps.push(...gradient);
  }

  chase.addPixelSteps(pixelSteps);

  return chase;
};

export const createChaseBuildupBlink = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_BLINK, true, color);

  const colors = getChaseColorValues(color);

  const { neopixelA, neopixelB } = devices.object();

  const steps: Array<number[]> = [];

  for (let i = 0; i < 4; i++) {
    for (let color of [colors.a, colors.b]) {
      const masters = [50, 100, 255, 100, 50];
      for (let master of masters) {
        steps.push([
          ...neopixelA.setAll({ ...color, master }),
          ...neopixelB.setAll({ ...color, master }),
        ]);
      }
      for (let j = 0; j < 32 - masters.length; j++) {
        steps.push([...neopixelA.empty(), ...neopixelB.empty()]);
      }
    }
  }

  chase.addSteps(new Array(steps.length / 4).fill(null).map(() => []));

  chase.addPixelSteps(steps);

  return chase;
};

export const createChaseBuildupBright = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_BRIGHT, false, color);
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

export const createChaseBuildupBlinder = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_BLINDER, true, color);

  const colors = getChaseColorValues(color);

  let steps: ChannelAnimation = [];

  for (let i = 0; i < 8; i++) {
    const color = i < 4 ? colors.a : colors.b;
    for (let j = 0; j < 4; j++) {
      const master = j * 255;
      steps.push(
        flattenChannelStates(
          devices.object().bar.state({ segments: 'all', master, ...color }),
          ...devices
            .object()
            .head.all.map((o) => o.state({ master, ...color })),
        ),
      );
    }
    steps.push([], [], [], []);
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationFront(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  return chase;
};

export const createChaseBuildupStreak = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_STREAK, true, color);

  const colors = getChaseColorValues(color);

  const { neopixelA, neopixelB } = devices.object();

  const steps: Array<number[]> = [];

  const getArray = (length: number, color: DeviceStateValues) => {
    return new Array(length).fill(null).map((o, index) => ({
      index,
      values: { ...color },
    }));
  };

  const off = [...neopixelA.clear(), ...neopixelB.clear()];

  for (let color of [colors.a, colors.b]) {
    for (let i = 0; i < 3; i++) {
      const state = getArray(Math.floor(neopixelA.length / 3) * (i + 1), color);
      for (let j = 0; j < 16; j++) {
        steps.push([
          ...neopixelA.setMultiple(state),
          ...neopixelB.setMultiple(state),
        ]);
      }
    }
    for (let j = 0; j < 16; j++) {
      steps.push(off);
    }
  }

  chase.addSteps(new Array(steps.length / 4).fill(null).map(() => []));

  chase.addPixelSteps(steps);

  return chase;
};

export const createChaseBuildupBeam = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_BEAM, true, color);
  const steps: ChannelAnimation = [];

  const colors = getChaseColorValues(color);

  const { left, right } = devices.object().head;

  for (const color of [colors.a, colors.b]) {
    for (let i = 0; i < 32; i++) {
      if (i < 16) {
        steps.push(
          flattenChannelStates(
            left.state({ master: 255, ...color }),
            right.state({}),
          ),
        );
      } else {
        steps.push(
          flattenChannelStates(
            left.state({}),
            right.state({ master: 255, ...color }),
          ),
        );
      }
    }
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationEight(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  return chase;
};
