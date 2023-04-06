import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
} from './chase-utils';

export const createChaseClub = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.CLUB, color);
  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);

  const steps = mergeDevicePatterns(bar, hex);

  chase.addSteps(steps);

  return chase;
};

const createHexPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { a, b, c, d, e, all } = devices.object().hex;

  const off = flattenChannelStates(
    ...all.map((hex) => hex.state({ master: 0 })),
  );

  for (const color of [colors.a, colors.b]) {
    steps.push(
      flattenChannelStates(
        ...all.map((hex) => hex.state({ master: 255, ...color, strobe: 240 })),
      ),
    );
    steps.push(off);

    // Front to back
    for (let i = 0; i < 14; i++) {
      switch (i % 3) {
        case 0:
          steps.push(
            flattenChannelStates(
              off,
              ...[a, b].map((hex) => hex.state({ master: 255, ...color })),
            ),
          );
          break;
        case 1:
          steps.push(
            flattenChannelStates(
              off,
              ...[c, d].map((hex) => hex.state({ master: 255, ...color })),
            ),
          );
          break;
        case 2:
          steps.push(
            flattenChannelStates(off, e.state({ master: 255, ...color })),
          );
          break;
      }
    }

    steps.push(
      flattenChannelStates(
        ...all.map((hex) => hex.state({ master: 255, ...color, strobe: 240 })),
      ),
    );
    steps.push(off);

    // Left / Right
    for (let i = 0; i < 14; i++) {
      switch (i % 2) {
        case 0:
          steps.push(
            flattenChannelStates(
              off,
              ...[a, c].map((hex) => hex.state({ master: 255, ...color })),
            ),
          );
          break;
        case 1:
          steps.push(
            flattenChannelStates(
              off,
              ...[b, d].map((hex) => hex.state({ master: 255, ...color })),
            ),
          );
          break;
      }
    }
  }

  return steps;
};

const createBarPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const bar = devices.object().bar;

  const off = bar.state({ segments: 'all', master: 0 });

  const pattern = [
    [3, 4],
    [],
    [2, 5],
    [],
    [1, 6],
    [],
    [0, 7],
    [],
    [1, 6],
    [],
    [2, 5],
    [],
  ];

  for (const color of [colors.a, colors.b]) {
    steps.push(
      bar.state({
        segments: 'all',
        master: 255,
        ...color,
        strobe: 240,
      }),
    );
    steps.push(off);
    for (let i = 0; i < 30; i++) {
      const index = i % pattern.length;
      const segments = pattern[index];
      steps.push(
        bar.state(
          { segments: 'all', master: 0 },
          { segments, master: 255, ...color },
        ),
      );
    }
  }

  return steps;
};
