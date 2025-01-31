import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceStateValues } from '../lib/device';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import { flattenChannelStates, mergeDevicePatterns } from './chase-utils';

const colors = [
  { r: 255 },
  { r: 255, g: 127 },
  { r: 255, g: 255 },
  { g: 255 },
  { b: 255 },
  { r: 127, b: 255 },
];

export const createChasePride = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.PRIDE, true, color);

  const bar = createBarPattern(devices);
  const beamer = createBeamerPattern(devices);
  const head = createHeadPattern(devices);
  const ball = createBallPattern(devices);

  const steps = mergeDevicePatterns(bar, head, beamer, ball);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  const pixelSteps = createPixelPattern(devices);
  chase.addPixelSteps(pixelSteps);

  return chase;
};

const createBarPattern = (devices: DeviceRegistry): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const bar = devices.object().bar;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 32; j++) {
      const master =
        j < 16
          ? Math.floor((255 / 16) * j)
          : Math.floor(255 - (255 / 16) * (j - 16));

      steps.push(
        flattenChannelStates(
          bar.state(
            ...colors.map((c, index) => ({
              segments: index + 1,
              master,
              ...c,
            })),
          ),
        ),
      );
    }
  }

  return steps;
};

const createBeamerPattern = (devices: DeviceRegistry): ChannelAnimation => {
  const steps: ChannelAnimation = [];
  const beamer = devices.object().beamer;

  for (let i = 0; i < 128; i++) {
    const iteration = Math.floor(i / 16);
    const color = colors[iteration % colors.length];

    steps.push(beamer.state({ master: 255, ...color }));
  }

  return steps;
};

const createHeadPattern = (devices: DeviceRegistry): ChannelAnimation => {
  const steps: ChannelAnimation = [];
  const head = devices.object().head;

  for (let i = 0; i < 128; i++) {
    steps.push(
      flattenChannelStates(
        ...head.all.map((o) =>
          o.state({ master: 255, r: 255, b: 200, strobe: 40 }),
        ),
      ),
    );
  }

  return steps;
};

const createBallPattern = (devices: DeviceRegistry): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { dome, spot } = devices.object();

  const off = flattenChannelStates(
    dome.state({ master: 0 }),
    spot.state({ master: 0 }),
  );

  const rainbowColorsSpot = [{ r: 255 }, { g: 255 }];

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 24; j++) {
      steps.push(off);
    }
    for (let j = 0; j < 16; j++) {
      steps.push(
        flattenChannelStates(
          dome.state({ master: 255, r: 127, b: 127, g: 127, movement: 127 }),
          spot.state({ master: 255, ...rainbowColorsSpot[i] }),
        ),
      );
    }
    for (let j = 0; j < 24; j++) {
      steps.push(off);
    }
  }

  return steps;
};

const createPixelPattern = (devices: DeviceRegistry): Array<number[]> => {
  const steps: Array<number[]> = [];

  const { neopixelA, neopixelB } = devices.object();

  const rainbow: DeviceStateValues[] = [];
  const length = neopixelA.length / colors.length;
  for (let i = 0; i < neopixelA.length; i++) {
    const color = colors[Math.floor(i / length)];
    rainbow.push({ ...color });
  }

  const shift = (
    values: DeviceStateValues[],
    iterations: number,
  ): DeviceStateValues[] => {
    const copy = [...values];
    for (let i = 0; i < iterations; i++) {
      copy.unshift(copy.pop());
    }
    return copy;
  };

  const movement = neopixelA.length / 128;
  for (let i = 0; i < 512; i++) {
    const gradient = shift(rainbow, Math.round(i * movement));
    const state = gradient.map((values, index) => ({ index, values }));
    steps.push([
      ...neopixelA.setMultiple(state),
      ...neopixelB.setMultiple(state),
    ]);
  }

  return steps;
};
