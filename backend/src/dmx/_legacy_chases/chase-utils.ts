import { DmxDeviceState } from '../lib/device';

export const warp = (
  steps: DmxDeviceState[],
  factor: number,
): DmxDeviceState[] => {
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
  state: DmxDeviceState,
  times: number,
): Array<DmxDeviceState> => new Array(times).fill(state);
