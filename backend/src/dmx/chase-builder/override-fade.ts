import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { ChannelState, DeviceStateValues } from '../lib/device';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import { flattenChannelStates, mergeDevicePatterns } from './chase-utils';

export const createChaseFade = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.FADE, color);

  const steps: ChannelAnimation = [];

  const colorLength = 32;
  const transitionIncrement = 255 / colorLength;

  // Red
  for (let i = 0; i < colorLength; i++) {
    steps.push(getState(devices, { master: 255, r: 255 }));
  }

  // Transition
  for (let i = 0; i < colorLength; i++) {
    steps.push(
      getState(devices, {
        master: 255,
        r: 255,
        g: Math.round(transitionIncrement * i),
      }),
    );
  }

  // Yellow
  for (let i = 0; i < colorLength; i++) {
    steps.push(getState(devices, { master: 255, r: 255, g: 255 }));
  }

  // Transition
  for (let i = 0; i < colorLength; i++) {
    steps.push(
      getState(devices, {
        master: 255,
        r: Math.round(255 - transitionIncrement * i),
        g: 255,
      }),
    );
  }

  // Green
  for (let i = 0; i < colorLength; i++) {
    steps.push(getState(devices, { master: 255, g: 255 }));
  }

  // Transition
  for (let i = 0; i < colorLength; i++) {
    steps.push(
      getState(devices, {
        master: 255,
        g: 255,
        b: Math.round(transitionIncrement * i),
      }),
    );
  }

  // Cyan
  for (let i = 0; i < colorLength; i++) {
    steps.push(getState(devices, { master: 255, g: 255, b: 255 }));
  }

  for (let i = 0; i < colorLength; i++) {
    steps.push(
      getState(devices, {
        master: 255,
        b: 255,
        g: Math.round(255 - transitionIncrement * i),
      }),
    );
  }

  // Blue
  for (let i = 0; i < colorLength; i++) {
    steps.push(getState(devices, { master: 255, b: 255 }));
  }

  // Transition
  for (let i = 0; i < colorLength; i++) {
    steps.push(
      getState(devices, {
        master: 255,
        r: Math.round(transitionIncrement * i),
        b: 255,
      }),
    );
  }

  // Pink
  for (let i = 0; i < colorLength; i++) {
    steps.push(getState(devices, { master: 255, r: 255, b: 255 }));
  }

  for (let i = 0; i < colorLength; i++) {
    steps.push(
      getState(devices, {
        master: 255,
        r: 255,
        b: Math.round(255 - transitionIncrement * i),
      }),
    );
  }

  // Red
  for (let i = 0; i < colorLength; i++) {
    steps.push(getState(devices, { master: 255, r: 255 }));
  }

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(steps.length));

  chase.addSteps(mergeDevicePatterns(steps, ...animations));

  return chase;
};

const getState = (
  devices: DeviceRegistry,
  values: DeviceStateValues,
): ChannelState[] => {
  const { bar, head, dome, spot, beamer, hex } = devices.object();

  return flattenChannelStates(
    ...hex.all.map((o, i2) => o.state({ ...values })),
    bar.state({ segments: 'all', ...values }),
    ...head.all.map((o) => o.state({ ...values })),
    dome.state({ ...values }),
    spot.state({ ...values }),
    beamer.state({ ...values }),
  );
};
