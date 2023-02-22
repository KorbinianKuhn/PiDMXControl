import {
  bar,
  dome,
  head1,
  head2,
  hex1,
  hex2,
  hex3,
  hex4,
  hex5,
  spot,
} from '../devices/devices';
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

interface DevicePresets {
  bar: {
    off: DmxDeviceState;
    mixed: { a: DmxDeviceState; b: DmxDeviceState };
    full: { a: DmxDeviceState; b: DmxDeviceState };
    strobe: { a: DmxDeviceState; b: DmxDeviceState };
  };
  hex: Array<{
    off: DmxDeviceState;
    a: DmxDeviceState;
    b: DmxDeviceState;
  }>;
  head: {
    left: {
      off: DmxDeviceState;
      a: DmxDeviceState;
      b: DmxDeviceState;
      strobe: {
        a: DmxDeviceState;
        b: DmxDeviceState;
      };
    };
    right: {
      off: DmxDeviceState;
      a: DmxDeviceState;
      b: DmxDeviceState;
      strobe: {
        a: DmxDeviceState;
        b: DmxDeviceState;
      };
    };
  };
  ball: {
    off: DmxDeviceState[];
    a: DmxDeviceState[];
    b: DmxDeviceState[];
  };
}

const getDevicePresets = (colors: Colors): DevicePresets => {
  return {
    bar: {
      off: bar.state([{ index: 'all', values: { master: 0 } }]),
      mixed: {
        a: bar.state([
          { index: 'even', values: { master: 255, ...colors.a } },
          { index: 'odd', values: { master: 255, ...colors.b } },
        ]),
        b: bar.state([
          { index: 'even', values: { master: 255, ...colors.b } },
          { index: 'odd', values: { master: 255, ...colors.a } },
        ]),
      },
      full: {
        a: bar.state([{ index: 'all', values: { master: 255, ...colors.a } }]),
        b: bar.state([{ index: 'all', values: { master: 255, ...colors.b } }]),
      },
      strobe: {
        a: bar.state([
          { index: 'all', values: { master: 255, ...colors.a, strobe: 255 } },
        ]),
        b: bar.state([
          { index: 'all', values: { master: 255, ...colors.b, strobe: 255 } },
        ]),
      },
    },
    hex: [hex1, hex2, hex3, hex4, hex5].map((hex) => ({
      off: hex.state({ master: 0 }),
      a: hex.state({ master: 255, ...colors.a }),
      b: hex.state({ master: 255, ...colors.b }),
    })),
    head: {
      left: {
        off: head1.state({ master: 0 }),
        a: head1.state({ master: 255, ...colors.a }),
        b: head1.state({ master: 255, ...colors.b }),
        strobe: {
          a: head1.state({ master: 255, ...colors.a, strobe: 255 }),
          b: head1.state({ master: 255, ...colors.b, strobe: 255 }),
        },
      },
      right: {
        off: head2.state({ master: 0 }),
        a: head2.state({ master: 255, ...colors.a }),
        b: head2.state({ master: 255, ...colors.b }),
        strobe: {
          a: head2.state({ master: 255, ...colors.a, strobe: 255 }),
          b: head2.state({ master: 255, ...colors.b, strobe: 255 }),
        },
      },
    },
    ball: {
      off: [dome.state({ master: 0 }), spot.state({ master: 0 })],
      a: [
        dome.state({ master: 255, ...colors.a }),
        spot.state({ master: 255, ...colors.a }),
      ],
      b: [
        dome.state({ master: 255, ...colors.b }),
        spot.state({ master: 255, ...colors.b }),
      ],
    },
  };
};

const createMoodyChase = (color: ChaseColor): Chase => {
  const chase = new Chase(ChaseName.MOODY, color);

  const colors = getColors(color);
  const { bar, hex, head, ball } = getDevicePresets(colors);

  // Pattern 1
  // const hexOrder = [3, 1, 4, 2, 3, 0, 4, 1, 2, 0, 4, 1, 3, 2];
  // let index
  for (let i = 0; i < 2; i++) {
    const color = i % 2 ? 'b' : 'a';
    chase.addStep(
      bar.mixed.a,
      ...hex.map((o) => o.off),
      head.left.strobe[color],
      head.right.strobe[color],
    );
    chase.addStep(
      bar.mixed.a,
      ...hex.map((o) => o.off),
      head.left.strobe[color],
      head.right.strobe[color],
    );
    chase.addStep(
      bar.mixed.b,
      ...hex.map((o) => o.off),
      hex[4][color],
      head.left.off,
      head.right.off,
    );
    chase.addStep(bar.mixed.b, ...hex.map((o) => o.off));
    chase.addStep(bar.mixed.a, ...hex.map((o) => o.off), hex[1][color]);
    chase.addStep(bar.mixed.a, ...hex.map((o) => o.off));
    chase.addStep(
      bar.mixed.b,
      ...hex.map((o) => o.off),
      hex[0][color],
      ...ball.off,
    );
    chase.addStep(bar.mixed.b, ...hex.map((o) => o.off), ...ball[color]);
    chase.addStep(
      bar.mixed.a,
      ...hex.map((o) => o.off),
      hex[3][color],
      ...ball[color],
    );
    chase.addStep(bar.mixed.a, ...hex.map((o) => o.off), ...ball[color]);
    chase.addStep(
      bar.mixed.b,
      ...hex.map((o) => o.off),
      hex[2][color],
      ...ball.off,
    );
    chase.addStep(bar.mixed.b, ...hex.map((o) => o.off));
    chase.addStep(bar.mixed.a, ...hex.map((o) => o.off), hex[4][color]);
    chase.addStep(bar.mixed.a, ...hex.map((o) => o.off));
    chase.addStep(bar.mixed.b, ...hex.map((o) => o.off), hex[0][color]);
    chase.addStep(bar.mixed.b, ...hex.map((o) => o.off));
  }

  // Pattern 2
  for (let i = 0; i < 4; i++) {
    const color = i % 2 ? 'b' : 'a';
    chase.addStep(
      bar.strobe[color],
      ...hex.map((o) => o[color]),
      head.left[color],
    );
    chase.addStep(bar.off, ...hex.map((o) => o.off), head.left[color]);
    chase.addStep(bar.off, ...hex.map((o) => o[color]), head.left[color]);
    chase.addStep(bar.off, ...hex.map((o) => o.off), head.left[color]);
    chase.addStep(bar.off, ...hex.map((o) => o[color]), head.right[color]);
    chase.addStep(bar.off, ...hex.map((o) => o.off), head.right[color]);
    chase.addStep(bar.off, ...hex.map((o) => o[color]), head.right[color]);
    chase.addStep(bar.off, ...hex.map((o) => o.off), head.right[color]);
  }

  // Pattern 3
  for (let i = 0; i < 4; i++) {
    const color = i % 2 ? 'b' : 'a';
    chase.addStep(
      bar.mixed.a,
      ...hex.map((o) => o.off),
      head.left.strobe[color],
      head.right.strobe[color],
      ...ball.off,
    );
    chase.addStep(
      bar.mixed.b,
      ...hex.map((o) => o.off),
      head.left.strobe[color],
      head.right.strobe[color],
      ...ball.off,
    );
    chase.addStep(
      bar.mixed.a,
      ...hex.map((o) => o.off),
      head.left.strobe[color],
      head.right.strobe[color],
      ...ball.off,
    );
    chase.addStep(
      bar.mixed.b,
      ...hex.map((o) => o.off),
      head.left.strobe[color],
      head.right.strobe[color],
      ...ball.off,
    );
    chase.addStep(
      bar.off,
      ...hex.map((o) => o[color]),
      head.left.off,
      head.right.off,
      ...ball[color],
    );
    chase.addStep(
      bar.off,
      ...hex.map((o) => o.off),
      head.left.off,
      head.right.off,
      ...ball[color],
    );
    chase.addStep(
      bar.off,
      ...hex.map((o) => o[color]),
      head.left.off,
      head.right.off,
      ...ball[color],
    );
    chase.addStep(
      bar.off,
      ...hex.map((o) => o.off),
      head.left.off,
      head.right.off,
      ...ball[color],
    );
  }

  return chase;
};

export const createMoodyChases = (): Chase[] => {
  return Object.values(ChaseColor).map((c) => createMoodyChase(c));
};
