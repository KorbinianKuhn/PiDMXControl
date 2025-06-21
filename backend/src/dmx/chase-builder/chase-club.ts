import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChannelWithLargestColorValue,
  getChaseColorValues,
  getPixelGradient,
  mergeDevicePatterns,
  mergePixelPatterns,
  repeat,
  warp,
} from './chase-utils';

export const createChaseClub = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.CLUB, true, color);
  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  const ball = createBallPattern(devices, colors);
  const head = createHeadPattern(devices, colors);
  const beamer = createBeamerPattern(devices, colors);

  const steps = mergeDevicePatterns(bar, hex, ball, head, beamer);

  const warped = warp(steps, 4);

  const animations = devices
    .object()
    .head.all.map((o) => repeat(o.animationNodding(steps.length), 4));

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

  for (const color of [colors.a, colors.b]) {
    steps.push(
      flattenChannelStates(
        ...all.map((hex) => hex.state({ master: 255, ...color, strobe: 240 })),
      ),
    );
    steps.push(off);

    // Front to back
    for (let i = 0; i < 14; i++) {
      switch (i % 3) {
        case 0:
          steps.push(
            flattenChannelStates(
              off,
              ...[a, b].map((hex) => hex.state({ master: 255, ...color })),
            ),
          );
          break;
        case 1:
          steps.push(
            flattenChannelStates(
              off,
              ...[c, d].map((hex) => hex.state({ master: 255, ...color })),
            ),
          );
          break;
        case 2:
          steps.push(
            flattenChannelStates(off, e.state({ master: 255, ...color })),
          );
          break;
      }
    }

    steps.push(
      flattenChannelStates(
        ...all.map((hex) => hex.state({ master: 255, ...color, strobe: 240 })),
      ),
    );
    steps.push(off);

    // Left / Right
    for (let i = 0; i < 14; i++) {
      switch (i % 2) {
        case 0:
          steps.push(
            flattenChannelStates(
              off,
              ...[a, c].map((hex) => hex.state({ master: 255, ...color })),
            ),
          );
          break;
        case 1:
          steps.push(
            flattenChannelStates(
              off,
              ...[b, d].map((hex) => hex.state({ master: 255, ...color })),
            ),
          );
          break;
      }
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

  const pattern = [
    [3, 4],
    [],
    [2, 5],
    [],
    [1, 6],
    [],
    [0, 7],
    [],
    [1, 6],
    [],
    [2, 5],
    [],
  ];

  for (const color of [colors.a, colors.b]) {
    steps.push(
      bar.state({
        segments: 'all',
        master: 255,
        w: 255,
        strobe: 240,
      }),
    );
    steps.push(off);
    for (let i = 0; i < 30; i++) {
      const index = i % pattern.length;
      const segments = pattern[index];
      steps.push(
        bar.state(
          { segments: 'all', master: 0 },
          { segments, master: 255, ...color },
        ),
      );
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
  const off = flattenChannelStates(
    spot.state({}),
    dome.state({ movement: 127 }),
  );

  for (let i = 0; i < 8; i++) {
    const color = i < 4 ? colors.a : colors.b;
    for (let j = 0; j < 4; j++) {
      steps.push(off);
    }
    for (let j = 0; j < 2; j++) {
      steps.push(
        flattenChannelStates(
          spot.state({ master: 255, ...color, strobe: 200 }),
          dome.state({
            master: 255,
            ...getChannelWithLargestColorValue(color),
            movement: 127,
            strobe: 200,
          }),
        ),
      );
    }
    for (let j = 0; j < 2; j++) {
      steps.push(off);
    }
  }

  return steps;
};

const createHeadPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { left, right } = devices.object().head;

  for (let i = 0; i < 32; i++) {
    if (i % 2) {
      steps.push(
        flattenChannelStates(
          left.state({ master: 255, ...colors.a }),
          right.state({}),
        ),
      );
    } else {
      steps.push(
        flattenChannelStates(
          left.state({}),
          right.state({ master: 255, ...colors.a }),
        ),
      );
    }
  }

  for (let i = 0; i < 32; i++) {
    if (i % 2) {
      steps.push(
        flattenChannelStates(
          left.state({ master: 255, ...colors.b }),
          right.state({}),
        ),
      );
    } else {
      steps.push(
        flattenChannelStates(
          left.state({}),
          right.state({ master: 255, ...colors.b }),
        ),
      );
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

  for (const color of [a, b]) {
    for (let i = 0; i < 32; i++) {
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

  let steps: Array<number[]> = [];

  const off = [...neopixelA.setAll({}), ...neopixelB.setAll({})];

  for (const color of [colors.a, colors.b]) {
    for (let i2 = 0; i2 < 4; i2++) {
      const a = getPixelGradient(neopixelA, color, 8, 32, 0, true);
      const b = getPixelGradient(neopixelB, color, 8, 32, 0, true);
      steps.push(...mergePixelPatterns(a, b));
      for (let i2 = 0; i2 < 96; i2++) {
        steps.push(off);
      }
    }
  }

  return steps;
};
