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
import { Chase, ChaseColor, ChaseName } from './chase';

const createOnChase = (color: ChaseColor): Chase => {
  const chase = new Chase(ChaseName.ON, color);

  for (let i = 0; i < 8; i++) {
    chase.addStep(
      hex1.state({ master: 255, [color]: 255 }),
      hex2.state({ master: 255, [color]: 255 }),
      hex3.state({ master: 255, [color]: 255 }),
      hex4.state({ master: 255, [color]: 255 }),
      hex5.state({ master: 255, [color]: 255 }),
      bar.state([{ index: 'all', values: { master: 255, [color]: 255 } }]),
      dome.state({ master: 255, [color]: 255 }),
      spot.state({ master: 255, [color]: 255 }),
      head1.state({ master: 255, [color]: 255 }),
      head2.state({ master: 255, [color]: 255 }),
    );
  }

  return chase;
};

export const createOnChases = (): Chase[] => {
  return Object.values(ChaseColor).map((c) => createOnChase(c));
};
