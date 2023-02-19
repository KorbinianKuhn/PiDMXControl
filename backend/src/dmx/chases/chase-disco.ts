import { hex1, hex2 } from '../devices/devices';
import { Chase, ChaseColor, ChaseName } from './chase';

export const createDiscoChase = (color: ChaseColor): Chase => {
  const chase = new Chase(ChaseName.DISCO, color);

  chase.addStep(
    hex1.state({ master: 255, r: 255 }),
    hex2.state({ master: 255, r: 255 }),
  );

  chase.addStep(
    hex1.state({ master: 255, g: 255 }),
    hex2.state({ master: 255, g: 255 }),
  );

  chase.addStep(
    hex1.state({ master: 255, b: 255 }),
    hex2.state({ master: 255, b: 255 }),
  );

  return chase;
};
