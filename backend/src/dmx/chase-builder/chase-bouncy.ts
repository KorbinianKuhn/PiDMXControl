import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
  repeat,
} from './chase-utils';

export const createChaseBouncy = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.BOUNCY, false, color);

  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  const beamer = createBeamerPattern(devices, colors);
  const head = createHeadPattern(devices, colors);

  const steps = mergeDevicePatterns(bar, hex, repeat(beamer, 4), head);

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
  const bar = devices.object().bar;

  const steps: ChannelAnimation = [];

  const one = [0, 7];
  const two = [1, 6];
  const three = [2, 5];
  const four = [3, 4];

  for (let i = 0; i < 4; i++) {
    for (const color of [colors.a, colors.b]) {
      steps.push(bar.state({ segments: three, ...color, master: 255 }));
      steps.push(bar.state({ segments: three, ...color, master: 255 }));
      steps.push(bar.state({ segments: three, ...color, master: 255 }));
      steps.push([]);
      steps.push(bar.state({ segments: two, ...color, master: 255 }));
      steps.push(bar.state({ segments: two, ...color, master: 255 }));
      steps.push(bar.state({ segments: two, ...color, master: 255 }));
      steps.push([]);
      steps.push(bar.state({ segments: one, ...color, master: 255 }));
      steps.push([]);
      steps.push(bar.state({ segments: two, ...color, master: 255 }));
      steps.push([]);
      steps.push(bar.state({ segments: three, ...color, master: 255 }));
      steps.push([]);
      steps.push(bar.state({ segments: four, ...color, master: 255 }));
      steps.push([]);
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

const createHeadPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { left, right, all } = devices.object().head;

  for (let i = 0; i < 4; i++) {
    if (i % 2) {
      steps.push(left.state({ ...colors.a, master: 255 }));
      steps.push(left.state({ ...colors.a, master: 255 }));
      steps.push(left.state({ ...colors.a, master: 255 }));
      steps.push([]);
      steps.push(right.state({ ...colors.a, master: 255 }));
      steps.push(right.state({ ...colors.a, master: 255 }));
      steps.push(right.state({ ...colors.a, master: 255 }));
      steps.push([]);
      steps.push(
        flattenChannelStates(
          ...all.map((o) => o.state({ ...colors.a, master: 255 })),
        ),
      );
      steps.push([]);
      steps.push(
        flattenChannelStates(
          ...all.map((o) => o.state({ ...colors.a, master: 255 })),
        ),
      );
      steps.push([]);
      steps.push(
        flattenChannelStates(
          ...all.map((o) => o.state({ ...colors.a, master: 255 })),
        ),
      );
      steps.push([]);
      steps.push(
        flattenChannelStates(
          ...all.map((o) => o.state({ ...colors.a, master: 255 })),
        ),
      );
      steps.push([]);
      for (let j = 0; j < 16; j++) {
        steps.push([]);
      }
    } else {
      for (let j = 0; j < 32; j++) {
        steps.push([]);
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
  const on = [...neopixelA.setAll({ w: 255 }), ...neopixelB.setAll({ w: 255 })];

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      steps.push(on);
    }
    for (let j = 0; j < 4; j++) {
      steps.push(off);
    }
    for (let j = 0; j < 4; j++) {
      steps.push(on);
    }
    for (let j = 0; j < 244; j++) {
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

  for (let i = 0; i < 16; i++) {
    steps.push(a);
  }
  for (let i = 0; i < 16; i++) {
    steps.push(b);
  }

  return steps;
};
