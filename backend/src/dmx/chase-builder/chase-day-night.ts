import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import { flattenChannelStates, mergeDevicePatterns, warp } from './chase-utils';

export const createChaseDay = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.DAY, color);

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

export const createChaseNight = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.NIGHT, color);

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
