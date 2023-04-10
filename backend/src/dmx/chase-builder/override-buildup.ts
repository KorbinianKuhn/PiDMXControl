import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import { getChaseColorValues, warp } from './chase-utils';

export const createChaseBuildup4 = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_4, color);
  const colors = getChaseColorValues(color);

  const { bar } = devices.object();

  const steps: ChannelAnimation = [];

  for (let i = 0; i < 4; i++) {
    const state = bar.state({
      segments: 'all',
    });
    steps.push(state);
  }

  for (let i = 0; i < 4; i++) {
    const state = bar.state({
      segments: 'all',
      master: 255,
      ...colors.a,
      strobe: 240,
    });
    steps.push(state);
  }

  const warped = warp(steps, 4);

  chase.addSteps(warped);

  return chase;
};

export const createChaseBuildup8 = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_8, color);
  const colors = getChaseColorValues(color);

  const { bar } = devices.object();

  const steps: ChannelAnimation = [];

  for (let i = 0; i < 8; i++) {
    const state = bar.state({
      segments: 'all',
    });
    steps.push(state);
  }

  for (let i = 0; i < 4; i++) {
    const state = bar.state({
      segments: 'all',
      master: 255,
      ...colors.a,
      strobe: 240,
    });
    steps.push(state);
  }

  const warped = warp(steps, 4);

  chase.addSteps(warped);

  return chase;
};

export const createChaseBuildup16 = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.BUILDUP_16, color);
  const colors = getChaseColorValues(color);

  const { bar } = devices.object();

  const steps: ChannelAnimation = [];

  for (let i = 0; i < 16; i++) {
    const state = bar.state({
      segments: 'all',
    });
    steps.push(state);
  }

  for (let i = 0; i < 4; i++) {
    const state = bar.state({
      segments: 'all',
      master: 255,
      ...colors.a,
      strobe: 240,
    });
    steps.push(state);
  }

  const warped = warp(steps, 4);

  chase.addSteps(warped);

  return chase;
};
