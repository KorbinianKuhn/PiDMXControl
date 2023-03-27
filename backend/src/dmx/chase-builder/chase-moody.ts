import { ChannelAnimation, Chase, ChaseColor } from '../lib/chase';
import { DeviceRegistry } from '../lib/device-registry';
import { ActiveProgramName } from '../lib/program';
import {
  Colors,
  flattenChannelStates,
  getChaseColorValues,
  mergeDevicePatterns,
} from './chase-utils';

export const createChaseMoody = (
  devices: DeviceRegistry,
  color: ChaseColor,
): Chase => {
  const chase = new Chase(ActiveProgramName.MOODY, color);
  const colors = getChaseColorValues(color);

  const bar = createBarPattern(devices, colors);
  const hex = createHexPattern(devices, colors);
  const ball = createBallPattern(devices, colors);
  const head = createHeadPattern(devices, colors);

  const steps = mergeDevicePatterns(bar, hex, ball, head);

  chase.addSteps(steps);

  return chase;
};

const createBarPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const bar = devices.object().bar;

  const off = bar.state({ segments: 'all', master: 0 });

  const mixedA = bar.state(
    { segments: 'odd', master: 255, ...colors.a },
    { segments: 'even', master: 255, ...colors.b },
  );

  const mixedB = bar.state(
    { segments: 'odd', master: 255, ...colors.b },
    { segments: 'even', master: 255, ...colors.a },
  );

  // 1-32: Glowy
  for (let i = 0; i < 8; i++) {
    steps.push(mixedA);
    steps.push(mixedA);
    steps.push(mixedB);
    steps.push(mixedB);
  }

  // 33-64: Blink
  for (const color of [colors.a, colors.b, colors.a, colors.b]) {
    for (let i = 0; i < 8; i++) {
      if (i === 0) {
        steps.push(bar.state({ segments: 'all', master: 255, ...color }));
      } else {
        steps.push(off);
      }
    }
  }

  // 65-96: Blink / Pause
  for (let i = 0; i < 4; i++) {
    steps.push(mixedA);
    steps.push(mixedB);
    steps.push(mixedA);
    steps.push(mixedB);
    steps.push(off);
    steps.push(off);
    steps.push(off);
    steps.push(off);
  }

  return steps;
};

const createHexPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { a, b, c, d, e, all } = devices.object().hex;

  const off = flattenChannelStates(...all.map((o) => o.state({ master: 0 })));

  // 1-32: Random
  const random = [d, b, e, c, d, a, e, b, c, a, e, b, d, c];
  for (const color of [colors.a, colors.b]) {
    for (let i = 0; i < 16; i++) {
      if (i < 2) {
        steps.push(off);
      } else if (i % 2 === 0) {
        steps.push(off);
      } else {
        const hex = random.shift();
        const state = flattenChannelStates(
          off,
          hex.state({ master: 255, ...color }),
        );
        steps.push(state);
      }
    }
  }

  // 33-64: Blink
  for (const color of [colors.a, colors.b, colors.a, colors.b]) {
    const state = flattenChannelStates(
      ...all.map((o) => o.state({ master: 255, ...color })),
    );
    for (let i = 0; i < 4; i++) {
      steps.push(state);
      steps.push(off);
    }
  }

  // 65-96: Blink / Pause
  for (const color of [colors.a, colors.b, colors.a, colors.b]) {
    const state = flattenChannelStates(
      ...all.map((o) => o.state({ master: 255, ...color })),
    );
    steps.push(off);
    steps.push(off);
    steps.push(off);
    steps.push(off);
    steps.push(state);
    steps.push(off);
    steps.push(state);
    steps.push(off);
  }

  return steps;
};

const createBallPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { dome, spot } = devices.object();

  const off = flattenChannelStates(
    dome.state({ master: 0 }),
    spot.state({ master: 0 }),
  );
  const a = flattenChannelStates(
    dome.state({ master: 255, ...colors.a }),
    spot.state({ master: 255, ...colors.a }),
  );

  const b = flattenChannelStates(
    dome.state({ master: 255, ...colors.b }),
    spot.state({ master: 255, ...colors.b }),
  );

  // 1 - 32
  for (const color of [a, b]) {
    for (let i = 0; i < 6; i++) {
      steps.push(off);
    }
    for (let i = 0; i < 4; i++) {
      steps.push(color);
    }
    for (let i = 0; i < 6; i++) {
      steps.push(off);
    }
  }

  // 33 - 64
  for (let i = 0; i < 32; i++) {
    steps.push(off);
  }

  // 65 - 96
  for (const color of [a, b, a, b]) {
    for (let i = 0; i < 4; i++) {
      steps.push(off);
    }
    steps.push(color);
    steps.push(off);
    steps.push(color);
    steps.push(off);
  }

  return steps;
};

const createHeadPattern = (
  devices: DeviceRegistry,
  colors: Colors,
): ChannelAnimation => {
  const steps: ChannelAnimation = [];

  const { left, right, all } = devices.object().head;

  const off = flattenChannelStates(...all.map((o) => o.state({ master: 0 })));
  const strobeA = flattenChannelStates(
    ...all.map((o) => o.state({ master: 255, ...colors.a, strobe: 240 })),
  );
  const strobeB = flattenChannelStates(
    ...all.map((o) => o.state({ master: 255, ...colors.b, strobe: 240 })),
  );

  const strobeASlow = flattenChannelStates(
    ...all.map((o) => o.state({ master: 255, ...colors.a, strobe: 10 })),
  );
  const strobeBSlow = flattenChannelStates(
    ...all.map((o) => o.state({ master: 255, ...colors.b, strobe: 10 })),
  );

  const leftOff = left.state({ master: 0 });
  const leftA = left.state({ master: 255, ...colors.a });
  const leftB = left.state({ master: 255, ...colors.b });
  const rightOff = right.state({ master: 0 });
  const rightA = right.state({ master: 255, ...colors.a });
  const rightB = right.state({ master: 255, ...colors.b });

  // 1 - 32
  for (const state of [strobeA, strobeB]) {
    for (let i = 0; i < 16; i++) {
      if (i < 2) {
        steps.push(state);
      } else {
        steps.push(off);
      }
    }
  }

  // 33 - 64
  for (let i = 0; i < 2; i++) {
    for (let i2 = 0; i2 < 4; i2++) {
      steps.push(flattenChannelStates(leftA, rightOff));
    }
    for (let i2 = 0; i2 < 4; i2++) {
      steps.push(flattenChannelStates(leftOff, rightA));
    }
    for (let i2 = 0; i2 < 4; i2++) {
      steps.push(flattenChannelStates(leftB, rightOff));
    }
    for (let i2 = 0; i2 < 4; i2++) {
      steps.push(flattenChannelStates(leftOff, rightB));
    }
  }

  // 65 - 96
  for (const state of [strobeASlow, strobeBSlow, strobeASlow, strobeBSlow]) {
    for (let i = 0; i < 4; i++) {
      steps.push(state);
    }
    for (let i = 0; i < 4; i++) {
      steps.push(off);
    }
  }

  const animationLeft = left.animationEight(96);
  const animationRight = right.animationEight(96);
  for (let i = 0; i < 96; i++) {
    steps[i].push(...animationLeft[i], ...animationRight[i]);
  }

  return steps;
};
