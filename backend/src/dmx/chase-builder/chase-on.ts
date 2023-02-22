import { Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import { flattenChannelStates, getChaseColorValues } from './chase-utils';

export const createChaseOn = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.ON, color);
  const colors = getChaseColorValues(color);

  const d = devices.object();

  const hex = d.hex.all.map((hex) => hex.state({ master: 255, ...colors.a }));
  const bar = d.bar.state({ segments: 'all', master: 255, ...colors.a });
  const dome = d.dome.state({ master: 255, ...colors.a });
  const spot = d.spot.state({ master: 255, ...colors.a });
  const heads = d.head.all.map((head) =>
    head.state({ master: 255, ...colors.a }),
  );

  const state = flattenChannelStates(...hex, bar, dome, spot, ...heads);

  for (let i = 0; i < 128; i++) {
    chase.addStep(state);
  }

  return chase;
};
