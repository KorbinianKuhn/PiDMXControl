import { bar, hex1, hex2, hex3, hex4, hex5 } from '../devices/devices';
import { DmxChannelStateValues, DmxDeviceState } from '../lib/device';
import { Chase, ChaseColor, ChaseName } from './chase';

interface Colors {
  a: DmxChannelStateValues;
  b: DmxChannelStateValues;
}

const getColors = (color: ChaseColor): Colors => {
  let a: DmxChannelStateValues = {};
  let b: DmxChannelStateValues = {};
  switch (color) {
    case ChaseColor.RED:
      a = { r: 255 };
      b = { r: 127, a: 127 };
      break;
    case ChaseColor.GREEN:
      a = { g: 255 };
      b = { g: 127, b: 127 };
      break;
    case ChaseColor.BLUE:
      a = { b: 255 };
      b = { g: 127, b: 127 };
      break;
    case ChaseColor.WHITE:
      a = { w: 255 };
      b = { r: 127, w: 127 };
      break;
    case ChaseColor.AMBER:
      a = { a: 255 };
      b = { r: 127, a: 127 };
      break;
    case ChaseColor.UV:
      a = { uv: 255 };
      b = { r: 127, b: 127 };
      break;
  }

  return { a, b };
};

const getHexStates = (colors: Colors): Array<DmxDeviceState[]> => {
  const hex = [hex1, hex2, hex3, hex4, hex5].map((hex) => ({
    off: hex.state({ master: 0 }),
    a: hex.state({ master: 255, ...colors.a }),
    b: hex.state({ master: 255, ...colors.b }),
  }));
  const off = hex.map((o) => o.off);

  const left = [0, 2, 4, 3, 1];
  const right = [1, 3, 4, 2, 0];

  const states: Array<DmxDeviceState[]> = [];
  let index = 0;
  for (let i = 0; i < 32; i++) {
    states.push([...off, hex[left[index]].a]);
    if (index === left.length - 1) {
      index = 0;
    } else {
      index++;
    }
  }

  return states;
};

const getBarAnimation = (colors: Colors): any => {
  const off = bar.state2('all', { master: 0 });
  const a1 = bar.state2([3, 4], { master: 255, ...colors.a });
  const a2 = bar.state2([2, 5], { master: 255, ...colors.a });
  const a3 = bar.state2([1, 6], { master: 255, ...colors.a });
  const a4 = bar.state2([0, 7], { master: 255, ...colors.a });

  const in_to_out = [a1, off, a2, off, a3, off, a4, off];
};

const createClubChase = (color: ChaseColor): Chase => {
  const chase = new Chase(ChaseName.CLUB, color);

  const colors = getColors(color);

  const hexStates = getHexStates(colors);

  for (const state of hexStates) {
    chase.addStep(...state);
  }

  return chase;
};

export const createClubChases = (): Chase[] => {
  return Object.values(ChaseColor).map((c) => createClubChase(c));
};
