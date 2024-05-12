import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import { flattenChannelStates, mergeDevicePatterns } from './chase-utils';

export const createChasePride = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.PRIDE, true, color);

  const { neopixelA, neopixelB, bar, head, beamer } = devices.object();

  const steps: ChannelAnimation = [];
  const pixelSteps: Array<number[]> = [];

  const colors = [
    { r: 255 },
    { r: 255, g: 127 },
    { r: 255, g: 255 },
    { g: 255 },
    { b: 255 },
    { r: 127, b: 255 },
  ];

  let counter = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 25; j++) {
      const master =
        j < 12
          ? Math.floor((255 / 12) * j)
          : Math.floor(255 - (255 / 12) * (j - 12));

      const color = colors[Math.floor(counter / (150 / colors.length))];

      steps.push(
        flattenChannelStates(
          bar.state(
            ...colors.map((c, index) => ({
              segments: index + 1,
              master,
              ...c,
            })),
          ),
          ...head.all.map((o) =>
            o.state({ master: 255, ...color, strobe: 40 }),
          ),
          beamer.state({ master: 255, ...color }),
        ),
      );

      counter++;
    }
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  const colorLength = Math.floor(neopixelA.length / colors.length);

  const rainbow = [];
  for (const color of colors) {
    for (let i = 0; i < colorLength; i++) {
      rainbow.push({ ...color });
    }
  }

  for (let i = 0; i < neopixelA.length - rainbow.length; i++) {
    rainbow.push({});
  }

  for (let i = 0; i < 600; i++) {
    const state = rainbow.map((values, index) => ({ index, values }));
    pixelSteps.push([
      ...neopixelA.setMultiple(state),
      ...neopixelB.setMultiple(state),
    ]);

    rainbow.unshift(rainbow.pop());
  }

  chase.addPixelSteps(pixelSteps);

  return chase;
};
