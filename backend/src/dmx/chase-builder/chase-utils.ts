import { NeopixelStrip } from '../devices/neopixel-strip';
import { ChannelAnimation, ChaseColor } from '../lib/chase';
import { ChannelState, DeviceStateValues } from '../lib/device';

export const random = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};

export const warp = (
  steps: ChannelAnimation,
  factor: number,
): ChannelAnimation => {
  const warped = new Array(steps.length * factor);

  let index = 0;
  for (const step of steps) {
    for (let i = 0; i < factor; i++) {
      warped[index] = step;
      index++;
    }
  }

  return warped;
};

export const repeat = (
  steps: ChannelAnimation,
  times: number,
): ChannelAnimation => {
  const array = [];
  for (let i = 0; i < times; i++) {
    array.push(...steps);
  }
  return array;
};

export interface Colors {
  a: DeviceStateValues;
  b: DeviceStateValues;
}

const COLORS = {
  red: { r: 255 },
  orange: { r: 255, g: 127 },
  amber: { a: 255 },
  yellow: { r: 255, g: 255 },
  lime: { r: 127, g: 255 },
  green: { g: 255 },
  emerald: { g: 255, b: 127 },
  teal: { g: 255, b: 200 },
  cyan: { b: 255, g: 255 },
  sky: { b: 255, g: 127 },
  blue: { b: 255 },
  indigo: { b: 255, r: 127 },
  violet: { uv: 255, b: 127 },
  purple: { uv: 255, r: 127 },
  fuchsia: { uv: 255, r: 255 },
  pink: { r: 255, b: 200 },
  white: { w: 255 },
};

const equalsColor = (a: DeviceStateValues, b: DeviceStateValues): boolean => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
};

export const getDomeColorValue = (
  color: DeviceStateValues,
): DeviceStateValues => {
  if (Object.keys(color).length < 2) {
    return color;
  }
  if (equalsColor(color, COLORS.orange)) {
    return { a: 200 };
  } else if (equalsColor(color, COLORS.yellow)) {
    return { a: 200 };
  } else if (equalsColor(color, COLORS.lime)) {
    return { g: 200 };
  } else if (equalsColor(color, COLORS.emerald)) {
    return { g: 200 };
  } else if (equalsColor(color, COLORS.teal)) {
    return { b: 200 };
  } else if (equalsColor(color, COLORS.cyan)) {
    return { b: 200 };
  } else if (equalsColor(color, COLORS.sky)) {
    return { b: 200 };
  } else if (equalsColor(color, COLORS.indigo)) {
    return { b: 200 };
  } else if (equalsColor(color, COLORS.violet)) {
    return { uv: 200 };
  } else if (equalsColor(color, COLORS.purple)) {
    return { uv: 200 };
  } else if (equalsColor(color, COLORS.fuchsia)) {
    return { uv: 200 };
  } else if (equalsColor(color, COLORS.pink)) {
    return { uv: 200 };
  } else {
    throw new Error(`Unknown color: ${JSON.stringify(color)}`);
  }
};

export const getChaseColorValues = (color: ChaseColor): Colors => {
  const [first, second] = color.split('-');

  const a: DeviceStateValues = COLORS[first];
  const b: DeviceStateValues = COLORS[second];

  if (a === undefined || b === undefined) {
    throw new Error('Undefined chases colors');
  }

  return { a, b };
};

export const flattenChannelStates = (
  ...states: Array<ChannelState[]>
): ChannelState[] => {
  const flatten: ChannelState[] = [];

  for (const state of states) {
    for (const channel of state) {
      const item = flatten.find((o) => o.address === channel.address);
      if (item) {
        item.value = channel.value;
      } else {
        flatten.push({ ...channel });
      }
    }
  }

  return flatten;
};

export const mergeDevicePatterns = (
  ...animations: ChannelAnimation[]
): ChannelAnimation => {
  const length = animations[0].length;
  const steps: ChannelAnimation = new Array(length).fill(null);

  for (const animation of animations) {
    if (animation.length !== length) {
      throw new Error(
        `Pattern lengths are not equal: ${length} and ${animation.length}`,
      );
    }
  }

  for (let i = 0; i < length; i++) {
    steps[i] = [];
    for (const animation of animations) {
      const step = animation[i];

      for (const channel of step) {
        const item = steps[i].find((o) => o.address === channel.address);
        if (item) {
          item.value = channel.value;
        } else {
          steps[i].push({ ...channel });
        }
      }
    }
  }

  return steps;
};

export const shiftPixels = (
  state: Array<{ index: number; values: DeviceStateValues }>,
  steps: number = 1,
) => {
  state.unshift(state.pop());
  for (let i = 0; i < state.length; i++) {
    state[i].index = i;
  }
  steps--;
  if (steps > 0) {
    shiftPixels(state, steps);
  }
};

export const getPixelGradient = (
  device: NeopixelStrip,
  color: DeviceStateValues,
  gradientLength: number,
  numSteps: number,
  offset: number = 0,
  reverse: boolean = false,
): Array<number[]> => {
  const steps: Array<number[]> = [];

  const anim = new Array(gradientLength)
    .fill(null)
    .map((o, i) => Math.floor((i * 255) / gradientLength));

  if (reverse) {
    anim.reverse();
  }

  const master = [...anim, ...new Array(device.length).fill(0)];

  const shift = (iterations: number): number[] => {
    const copy = [...master];
    for (let i = 0; i < iterations; i++) {
      copy.unshift(copy.pop());
    }
    return copy;
  };

  const getValues = (master: number[]) => {
    return master.slice(gradientLength).map((master, index) => ({
      index,
      values: {
        ...color,
        master,
      },
    }));
  };

  const movement = (device.length + gradientLength) / numSteps;

  for (let i = 0; i < numSteps; i++) {
    steps.push(
      device.setMultiple(getValues(shift(Math.round(i * movement) + offset))),
    );
  }

  if (reverse) {
    return steps.reverse();
  }

  return steps;
};

export const getPixelGlowing = (
  numPixels: number,
  totalDuration: number,
  glowingDuration: number,
  maxBrightness: number = 255,
): Array<number[]> => {
  const steps: Array<number[]> = [];

  const animation = new Array(glowingDuration / 2)
    .fill(null)
    .map((o, i) =>
      Math.floor(((i + 1) * maxBrightness) / (glowingDuration / 2)),
    );
  animation.push(Math.max(...animation));
  animation.push(...animation.slice(1, -1).reverse());

  const shift = (values: number[], iterations: number) => {
    const result = [...values];
    for (let i = 0; i < iterations; i++) {
      result.unshift(result.pop());
    }
    return result;
  };

  const randomAnimationState = () => {
    const randomInt = Math.floor(Math.random() * animation.length);
    return shift(animation, randomInt);
  };

  const animations = new Array(numPixels)
    .fill(null)
    .map(() => randomAnimationState());

  for (let i = 0; i < totalDuration; i++) {
    const step = new Array(numPixels).fill(null);
    for (let j = 0; j < numPixels; j++) {
      step[j] = animations[j][0];
      animations[j] = shift(animations[j], 1);
    }
    steps.push(step);
  }

  return steps;
};

export const mergePixelPatterns = (
  a: Array<number[]>,
  b: Array<number[]>,
): Array<number[]> => {
  const steps: Array<number[]> = [];

  for (let i = 0; i < a.length; i++) {
    steps.push([...a[i], ...b[i]]);
  }

  return steps;
};
