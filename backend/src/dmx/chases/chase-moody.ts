import { bar, hex1, hex2, hex3, hex4, hex5 } from '../devices/devices';
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

  const barFullA = bar.state([
    { index: 'all', values: { master: 255, ...colorA } },
  ]);

  const barFullB = bar.state([
    { index: 'all', values: { master: 255, ...colorB } },
  ]);

  const hex1A = [
    hex1.state({ master: 255, ...colorA }),
    hex2.state({ master: 0 }),
    hex3.state({ master: 0 }),
    hex4.state({ master: 0 }),
    hex5.state({ master: 0 }),
  ];

  const hex1B = [
    hex1.state({ master: 255, ...colorB }),
    hex2.state({ master: 0 }),
    hex3.state({ master: 0 }),
    hex4.state({ master: 0 }),
    hex5.state({ master: 0 }),
  ];

  const hex2A = [
    hex1.state({ master: 0 }),
    hex2.state({ master: 255, ...colorA }),
    hex3.state({ master: 0 }),
    hex4.state({ master: 0 }),
    hex5.state({ master: 0 }),
  ];

  const hex2B = [
    hex1.state({ master: 0 }),
    hex2.state({ master: 255, ...colorB }),
    hex3.state({ master: 0 }),
    hex4.state({ master: 0 }),
    hex5.state({ master: 0 }),
  ];

  const hex3A = [
    hex1.state({ master: 0 }),
    hex2.state({ master: 0 }),
    hex3.state({ master: 255, ...colorA }),
    hex4.state({ master: 0 }),
    hex5.state({ master: 0 }),
  ];

  const hex3B = [
    hex1.state({ master: 0 }),
    hex2.state({ master: 0 }),
    hex3.state({ master: 255, ...colorB }),
    hex4.state({ master: 0 }),
    hex5.state({ master: 0 }),
  ];

  const hex4A = [
    hex1.state({ master: 0 }),
    hex2.state({ master: 0 }),
    hex3.state({ master: 0 }),
    hex4.state({ master: 255, ...colorA }),
    hex5.state({ master: 0 }),
  ];

  const hex4B = [
    hex1.state({ master: 0 }),
    hex2.state({ master: 0 }),
    hex3.state({ master: 0 }),
    hex4.state({ master: 255, ...colorB }),
    hex5.state({ master: 0 }),
  ];

  const hex5A = [
    hex1.state({ master: 0 }),
    hex2.state({ master: 0 }),
    hex3.state({ master: 0 }),
    hex4.state({ master: 0 }),
    hex5.state({ master: 255, ...colorA }),
  ];

  const hex5B = [
    hex1.state({ master: 0 }),
    hex2.state({ master: 0 }),
    hex3.state({ master: 0 }),
    hex4.state({ master: 0 }),
    hex5.state({ master: 255, ...colorB }),
  ];

  for (let i = 0; i < 8; i++) {
    // 8 Blocks
    chase.addStep(...hex1A, barMixedA);
    chase.addStep(...hex2A, barMixedA);
    chase.addStep(...hex3A, barMixedB);
    chase.addStep(...hex4A, barMixedB);
    chase.addStep(...hex5A, barMixedA);
    chase.addStep(...hex1B, barMixedA);
    chase.addStep(...hex2B, barMixedB);
    chase.addStep(...hex3B, barMixedB);

    // 8 Blocks
    chase.addStep(...hex4B, barMixedA);
    chase.addStep(...hex5B, barMixedA);
    chase.addStep(...hex1A, barMixedB);
    chase.addStep(...hex2A, barMixedB);
    chase.addStep(...hex3A, barMixedA);
    chase.addStep(...hex4A, barMixedA);
    chase.addStep(...hex5A, barMixedB);
    chase.addStep(barFullA);
  }

  return chase;
};

export const createMoodyChases = (): Chase[] => {
  return Object.values(ChaseColor).map((c) => createMoodyChase(c));
};
