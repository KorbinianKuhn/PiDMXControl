import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import { flattenChannelStates, getChaseColorValues } from './chase-utils';

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

  return steps.slice(steps.length - 16 - length);
};

export const createChaseBuildupInfinite = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_INFINITE, color);

  const steps = getBuildupSteps(32, devices, color).slice(0, 16);

  chase.addSteps(steps);

  return chase;
};

export const createChaseBuildup4 = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_4, color);

  const steps = getBuildupSteps(16, devices, color);

  chase.addSteps(steps);

  return chase;
};

export const createChaseBuildup8 = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_8, color);

  const steps = getBuildupSteps(32, devices, color);

  chase.addSteps(steps);

  return chase;
};

export const createChaseBuildup16 = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_16, color);

  const steps = getBuildupSteps(64, devices, color);

  chase.addSteps(steps);

  return chase;
};
