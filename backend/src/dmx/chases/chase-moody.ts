import { bar, hex1, hex2 } from '../devices/devices';
import { Chase, ChaseColor, ChaseName } from './chase';

const createMoodyChase = (color: ChaseColor): Chase => {
  const chase = new Chase(ChaseName.MOODY, color);

  for (let i = 0; i < 8; i++) {
    chase.addStep(
      hex1.state({ master: 255, [color]: 255 }),
      hex2.state({ master: 0 }),
      bar.state([{ index: 'even', values: { master: 255, uv: 255 } }]),
      bar.state([{ index: 'odd', values: { master: 255, b: 255 } }]),
    );
    chase.addStep(
      hex1.state({ master: 0 }),
      hex2.state({ master: 255, [color]: 255 }),
      bar.state([{ index: 0, values: { master: 0 } }]),
      bar.state([{ index: 'even', values: { master: 255, b: 255 } }]),
      bar.state([{ index: 'odd', values: { master: 255, uv: 255 } }]),
    );
  }

  return chase;
};

export const createMoodyChases = (): Chase[] => {
  return Object.values(ChaseColor).map((c) => createMoodyChase(c));
};
