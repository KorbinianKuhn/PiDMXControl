import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
  warp,
} from './chase-utils';

export const createChaseOn = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.ON, true, color);
  const colors = getChaseColorValues(color);

  const d = devices.object();

  const hex = d.hex.all.map((hex) => hex.state({ master: 255, ...colors.a }));
  const bar = d.bar.state({ segments: 'all', master: 255, ...colors.a });
  const dome = d.dome.state({ master: 255, ...colors.a });
  const spot = d.spot.state({ master: 255, ...colors.a });
  const heads = d.head.all.map((head) =>
    head.state({ master: 255, ...colors.a }),
  );
  const beamer = d.beamer.state({ master: 255, ...colors.a });

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
