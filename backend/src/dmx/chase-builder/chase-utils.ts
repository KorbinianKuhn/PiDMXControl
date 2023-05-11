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
  green: { g: 255 },
  blue: { b: 255 },
  uv: { uv: 255, b: 127 },
  amber: { a: 255 },
  cyan: { b: 255, g: 255 },
  pink: { r: 255, b: 200 },
  teal: { g: 255, b: 200 },
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
