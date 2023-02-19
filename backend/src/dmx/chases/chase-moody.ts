import { bar, hex1, hex2 } from '../devices/devices';
import { Chase, ChaseColor, ChaseName } from './chase';

const createMoodyChase = (color: ChaseColor): Chase => {
  const chase = new Chase(ChaseName.MOODY, color);

  let colorA;
  let colorB;
  switch (color) {
    case ChaseColor.RED:
      colorA = { r: 255 };
      colorB = { r: 127, a: 127 };
      break;
    case ChaseColor.GREEN:
      colorA = { g: 255 };
      colorB = { g: 127, b: 127 };
      break;
    case ChaseColor.BLUE:
      colorA = { b: 255 };
      colorB = { g: 127, b: 127 };
      break;
    case ChaseColor.WHITE:
      colorA = { w: 255 };
      colorB = { r: 127, w: 127 };
      break;
    case ChaseColor.AMBER:
      colorA = { a: 255 };
      colorB = { r: 127, a: 127 };
      break;
    case ChaseColor.UV:
      colorA = { uv: 255 };
      colorB = { r: 127, b: 127 };
      break;
  }

  const barMixedA = bar.state([
    { index: 'even', values: { master: 255, ...colorA } },
    { index: 'odd', values: { master: 255, ...colorB } },
  ]);

  const barMixedB = bar.state([
    { index: 'even', values: { master: 255, ...colorB } },
    { index: 'odd', values: { master: 255, ...colorA } },
  ]);

  for (let i = 0; i < 8; i++) {
    chase.addStep(
      hex1.state({ master: 255, ...colorA }),
      hex2.state({ master: 0 }),
      barMixedA,
    );
    chase.addStep(
      hex1.state({ master: 0 }),
      hex2.state({ master: 255, ...colorA }),
      barMixedA,
    );
    chase.addStep(
      hex1.state({ master: 255, ...colorB }),
      hex2.state({ master: 0 }),
      barMixedB,
    );
    chase.addStep(
      hex1.state({ master: 0 }),
      hex2.state({ master: 255, ...colorB }),
      barMixedB,
    );
  }

  return chase;
};

export const createMoodyChases = (): Chase[] => {
  return Object.values(ChaseColor).map((c) => createMoodyChase(c));
};
