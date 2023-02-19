import { bar, hex1, hex2 } from '../devices/devices';
import { Chase, ChaseColor, ChaseName } from './chase';

const createOnChase = (color: ChaseColor): Chase => {
  const chase = new Chase(ChaseName.ON, color);

  for (let i = 0; i < 8; i++) {
    chase.addStep(
      hex1.state({ master: 255, [color]: 255 }),
      hex2.state({ master: 255, [color]: 255 }),
      bar.state([{ index: 0, values: { master: 255, [color]: 255 } }]),
    );
  }

  return chase;
};

export const createOnChases = (): Chase[] => {
  return Object.values(ChaseColor).map((c) => createOnChase(c));
};
