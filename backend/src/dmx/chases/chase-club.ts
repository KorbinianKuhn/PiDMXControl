import { bar, hex1, hex2 } from '../devices/devices';
import { Chase, ChaseColor, ChaseName } from './chase';

const createClubChase = (color: ChaseColor): Chase => {
  const chase = new Chase(ChaseName.CLUB, color);

  for (let i = 0; i < 8; i++) {
    chase.addStep(
      hex1.state({ master: 255, [color]: 255 }),
      hex2.state({ master: 255, [color]: 255 }),
      bar.state([{ index: 'all', values: { master: 255, [color]: 255 } }]),
    );
    chase.addStep(
      hex1.state({ master: 0 }),
      hex2.state({ master: 0 }),
      bar.state([{ index: 'all', values: { master: 0 } }]),
    );
  }

  return chase;
};

export const createClubChases = (): Chase[] => {
  return Object.values(ChaseColor).map((c) => createClubChase(c));
};
