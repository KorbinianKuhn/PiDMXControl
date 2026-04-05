import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
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
        ...head.all.map((o) => o.state({ ...colors.a, master })),
        ...hex.all.map((o) => o.state({ ...colors.a, master })),
        bar.state({
          ...colors.a,
          segments: 'all',
          master,
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
            ...color,
            master: 255,
            strobe: 240,
          }),
          ...head.all.map((o) =>
            o.state({
              ...color,
              master: 255,
              strobe: 240,
            }),
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
    getPixelGradient(
      neopixelA,
      {
        ...colors.a,
        master: 255,
      },
      8,
      8,
    ),
    getPixelGradient(neopixelB, { ...colors.a, master: 255 }, 8, 8),
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
          ...neopixelA.setAll({
            ...color,
            master,
          }),
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
    devices.object().bar.state({ segments: 'all', ...colors.a, master: 255 }),
    ...devices
      .object()
      .head.all.map((o) => o.state({ ...colors.a, master: 255 })),
    ...devices
      .object()
      .hex.all.map((o) => o.state({ ...colors.a, master: 255 })),
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
          devices.object().bar.state({ segments: 'all', ...color, master }),
          ...devices
            .object()
            .head.all.map((o) => o.state({ ...color, master })),
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

  const { bar } = devices.object();

  const steps: ChannelAnimation = [];
  for (let color of [colors.a, colors.b]) {
    for (let i = 0; i < 8; i++) {
      steps.push(
        flattenChannelStates(bar.state({ segments: i, ...color, master: 255 })),
      );
    }
    for (let i = 7; i >= 0; i--) {
      steps.push(
        flattenChannelStates(bar.state({ segments: i, ...color, master: 255 })),
      );
    }
  }

  chase.addSteps(steps);

  const { neopixelA, neopixelB } = devices.object();

  const pixelSteps: Array<number[]> = [];

  for (const color of [colors.a, colors.b]) {
    const a = getPixelGradient(neopixelA, color, 32, 64);
    const b = getPixelGradient(neopixelB, color, 32, 64, 64);
    for (let j = 0; j < a.length; j++) {
      pixelSteps.push([...a[j], ...b[j]]);
    }
  }

  chase.addPixelSteps(pixelSteps);

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
            left.state({ ...color, master: 255 }),
            right.state({ ...color, master: 0 }),
          ),
        );
      } else {
        steps.push(
          flattenChannelStates(
            left.state({ ...color, master: 0 }),
            right.state({ ...color, master: 255 }),
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

export const createChaseBuildupTest = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_TEST, true);

  const steps: ChannelAnimation = [];

  const { bar } = devices.object();

  const color = { master: 255, w: 255 };

  const a = bar.state({ segments: [2, 5], ...color });
  const b = bar.state({ segments: [1, 6], ...color });

  const one = bar.state({ segments: [0, 7], ...color });
  const two = bar.state({ segments: [1, 6], ...color });
  const three = bar.state({ segments: [2, 5], ...color });
  const four = bar.state({ segments: [3, 4], ...color });

  steps.push(a);
  steps.push(a);
  steps.push(a);
  steps.push([]);
  steps.push(b);
  steps.push(b);
  steps.push(b);
  steps.push([]);
  steps.push(one);
  steps.push([]);
  steps.push(two);
  steps.push([]);
  steps.push(three);
  steps.push([]);
  steps.push(four);
  steps.push([]);

  chase.addSteps(steps);

  return chase;
};
