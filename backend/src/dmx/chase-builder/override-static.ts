import { ChannelAnimation, Chase } from '../lib/chase';
import { ChannelState, DeviceStateValues } from '../lib/device';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import { flattenChannelStates, mergeDevicePatterns, warp } from './chase-utils';

export const createChaseFade = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.FADE, true);

  const steps: ChannelAnimation = [];

  const colorLength = 32;
  const transitionIncrement = 255 / colorLength;

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

export const createChaseWarm = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.WARM, true);

  const d = devices.object();

  const hex = d.hex.all.map((hex) => hex.state({ master: 255, a: 255 }));
  const bar = d.bar.state({ segments: 'all', master: 255, a: 255 });
  const dome = d.dome.state({ master: 255, a: 255 });
  const spot = d.spot.state({ master: 255, a: 255 });
  const heads = d.head.all.map((head) => head.state({ master: 255, a: 255 }));
  const beamer = d.beamer.state({ master: 255, a: 255 });

  const state = flattenChannelStates(...hex, bar, dome, spot, ...heads, beamer);

  const steps: ChannelAnimation = [];
  for (let i = 0; i < 16; i++) {
    steps.push(state);
  }

  const warped = warp(steps, 4);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(warped.length));

  chase.addSteps(mergeDevicePatterns(warped, ...animations));

  return chase;
};

export const createChaseNight = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.NIGHT, true);

  const d = devices.object();

  const hex = d.hex.all.map((hex) => hex.state({ master: 255, b: 255 }));
  const bar = d.bar.state({ segments: 'all', master: 255, b: 255 });
  const dome = d.dome.state({ master: 255, b: 255 });
  const spot = d.spot.state({ master: 255, b: 255 });
  const heads = d.head.all.map((head) => head.state({ master: 255, b: 255 }));
  const beamer = d.beamer.state({ master: 255, b: 255 });

  const state = flattenChannelStates(...hex, bar, dome, spot, ...heads, beamer);

  const steps: ChannelAnimation = [];
  for (let i = 0; i < 16; i++) {
    steps.push(state);
  }

  const warped = warp(steps, 4);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(warped.length));

  chase.addSteps(mergeDevicePatterns(warped, ...animations));

  return chase;
};

export const createChaseWhite = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.WHITE, true);

  const d = devices.object();

  const hex = d.hex.all.map((hex) => hex.state({ master: 255, w: 255 }));
  const bar = d.bar.state({ segments: 'all', master: 255, w: 255 });
  const dome = d.dome.state({ master: 255, w: 255 });
  const spot = d.spot.state({ master: 255, w: 255 });
  const heads = d.head.all.map((head) => head.state({ master: 255, w: 255 }));
  const beamer = d.beamer.state({ master: 255, w: 255 });

  const state = flattenChannelStates(...hex, bar, dome, spot, ...heads, beamer);

  const steps: ChannelAnimation = [];
  for (let i = 0; i < 16; i++) {
    steps.push(state);
  }

  const warped = warp(steps, 4);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(warped.length));

  chase.addSteps(mergeDevicePatterns(warped, ...animations));

  return chase;
};

export const createChaseDay = (devices: DeviceRegistry): Chase => {
  const chase = new Chase(OverrideProgramName.DAY, true);

  const d = devices.object();

  const hex = d.hex.all.map((hex) =>
    hex.state({ master: 255, w: 127, a: 127 }),
  );
  const bar = d.bar.state({ segments: 'all', master: 255, w: 127, a: 127 });
  const dome = d.dome.state({ master: 255, w: 127, a: 127 });
  const spot = d.spot.state({ master: 255, w: 127, a: 127 });
  const heads = d.head.all.map((head) =>
    head.state({ master: 255, w: 127, a: 127 }),
  );
  const beamer = d.beamer.state({ master: 255, w: 127, a: 127 });

  const state = flattenChannelStates(...hex, bar, dome, spot, ...heads, beamer);

  const steps: ChannelAnimation = [];
  for (let i = 0; i < 16; i++) {
    steps.push(state);
  }

  const warped = warp(steps, 4);

  const animations = devices
    .object()
    .head.all.map((o) => o.animationTop(warped.length));

  chase.addSteps(mergeDevicePatterns(warped, ...animations));

  return chase;
};
