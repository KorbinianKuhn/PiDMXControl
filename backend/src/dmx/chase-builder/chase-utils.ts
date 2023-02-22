import { ChannelAnimation, ChaseColor } from '../lib/chase';
import { ChannelState, DeviceStateValues } from '../lib/device';

export const warp = (steps: ChannelState[], factor: number): ChannelState[] => {
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
  states: ChannelState[],
  times: number,
): Array<ChannelState> => new Array(times).fill(states);

export interface Colors {
  a: DeviceStateValues;
  b: DeviceStateValues;
}

export const getChaseColorValues = (color: ChaseColor): Colors => {
  let a: DeviceStateValues = {};
  let b: DeviceStateValues = {};
  switch (color) {
    case ChaseColor.UV_PINK:
      a = { uv: 255 };
      b = { r: 127, uv: 255 };
      break;
    case ChaseColor.BLUE_CYAN:
      a = { b: 255 };
      b = { b: 255, g: 255 };
      break;
    case ChaseColor.RED_AMBER:
      a = { r: 255 };
      b = { a: 255 };
      break;
    case ChaseColor.GREEN_CYAN:
      a = { g: 255 };
      b = { g: 255, b: 255 };
      break;

    case ChaseColor.RED_WHITE:
      a = { r: 255 };
      b = { w: 255 };
      break;
    // case ChaseColor.GREEN:
    //   a = { g: 255 };
    //   b = { g: 127, b: 127 };
    //   break;
    // case ChaseColor.BLUE:
    //   a = { b: 255 };
    //   b = { g: 127, b: 127 };
    //   break;
    // case ChaseColor.WHITE:
    //   a = { w: 255 };
    //   b = { r: 127, w: 127 };
    //   break;
    // case ChaseColor.AMBER:
    //   a = { a: 255 };
    //   b = { r: 127, a: 127 };
    //   break;
    default:
      throw new Error('Undefined chases colors');
  }

  return { a, b };
};

export const flattenChannelStates = (
  ...states: Array<ChannelState[]>
): ChannelState[] => {
  const flatten: ChannelState[] = [];

  for (const state of states) {
    flatten.push(...state);
  }

  return flatten;
};

export const mergeDevicePatterns = (
  ...patterns: ChannelAnimation[]
): ChannelAnimation => {
  const length = patterns[0].length;
  const steps: ChannelAnimation = new Array(length).fill(null);

  for (const pattern of patterns) {
    if (pattern.length !== length) {
      throw new Error('Pattern lengths are not equal');
    }
  }

  for (let i = 0; i < length; i++) {
    steps[i] = [];
    for (const pattern of patterns) {
      steps[i].push(...pattern[i]);
    }
  }

  return steps;
};
