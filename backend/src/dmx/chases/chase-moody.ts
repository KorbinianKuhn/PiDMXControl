import { hex1, hex2 } from '../devices/devices';
import { Chase, ChaseColor, ChaseName } from './chase';

const createMoodyChase = (color: ChaseColor): Chase => {
  const chase = new Chase(ChaseName.MOODY, color);

  for (let i = 0; i < 8; i++) {
    chase.addStep(
      hex1.state({ master: 255, [color]: 255 }),
      hex2.state({ master: 0 }),
    );
    chase.addStep(
      hex1.state({ master: 0 }),
      hex2.state({ master: 255, [color]: 255 }),
    );
  }

  return chase;
};

export const createMoodyChases = (): Chase[] => {
  return Object.values(ChaseColor).map((c) => createMoodyChase(c));
};
