import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import {
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
  repeat,
} from './chase-utils';

export const createChaseStrobeInfinite = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_INFINITE, color);

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
        dome.state({ master: 255, ...color, strobe: 250 }),
        spot.state({ master: 255, ...color, strobe: 250 }),
        beamer.state({ master: 255, ...color, strobe: 120 }),
      );

      steps.push(state);
    }
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  return chase;
};

export const createChaseStrobeA = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_A, color);

  const steps: ChannelAnimation = [];

  const colors = getChaseColorValues(color);

  const { bar, head, dome, spot, beamer, hex } = devices.object();

  for (let i = 0; i < 4; i++) {
    const state = flattenChannelStates(
      ...hex.all.map((o, i2) =>
        i2 === i
          ? o.state({ master: 255, w: 255 })
          : o.state({ master: 0, w: 0 }),
      ),
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 250 }),
      ...head.all.map((o) =>
        o.state({ master: 255, ...colors.a, strobe: 250 }),
      ),
      dome.state({ master: 255, ...colors.a, strobe: 250 }),
      spot.state({ master: 255, ...colors.a, strobe: 250 }),
      beamer.state({ master: 255, ...colors.a, strobe: 120 }),
    );
    steps.push(state);
  }

  const warped = repeat(steps, 4);

  const animations = devices
    .object()
    .head.all.map((o) => repeat(o.animationTop(steps.length), 4));

  chase.addSteps(mergeDevicePatterns(warped, ...animations));

  return chase;
};

export const createChaseStrobeB = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_B, color);

  const steps: ChannelAnimation = [];

  const colors = getChaseColorValues(color);

  const on = flattenChannelStates(
    ...devices
      .object()
      .head.all.map((o) => o.state({ master: 255, ...colors.a, strobe: 100 })),
  );

  for (let i = 0; i < 16; i++) {
    steps.push(on);
  }

  chase.addSteps(steps);

  return chase;
};

export const createChaseStrobeC = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_C, color);
  const colors = getChaseColorValues(color);
  const steps: ChannelAnimation = [];

  const { bar, head } = devices.object();

  for (let i = 0; i < 16; i++) {
    const state = flattenChannelStates(
      bar.state({ segments: 'all', master: 255, ...colors.a, strobe: 250 }),
      ...head.all.map((o) =>
        o.state({ master: 255, ...colors.a, strobe: 250 }),
      ),
    );
    steps.push(state);
  }

  chase.addSteps(steps);

  return chase;
};

export const createChaseStrobeD = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE_D, color);

  const steps: ChannelAnimation = [];

  const { bar, head } = devices.object();

  for (let i = 0; i < 16; i++) {
    const state = flattenChannelStates(
      bar.state({ segments: 'all', master: 255, w: 255, strobe: 250 }),
      ...head.all.map((o) => o.state({ master: 255, w: 255, strobe: 250 })),
    );
    steps.push(state);
  }

  chase.addSteps(steps);

  return chase;
};
