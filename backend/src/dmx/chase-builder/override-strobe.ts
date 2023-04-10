import { Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { OverrideProgramName } from '../lib/program';
import { flattenChannelStates, getChaseColorValues } from './chase-utils';

export const createChaseStrobe = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(OverrideProgramName.STROBE, color);

  const colors = getChaseColorValues(color);

  const { bar, head, dome, spot, beamer, hex } = devices.object();

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

      chase.addStep(state);
    }
  }

  return chase;
};
