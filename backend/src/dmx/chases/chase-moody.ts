import { hex1, hex2 } from '../devices/devices';
import { Chase, ChaseColor } from './chase';

export const createMoodyChase = (name: string, color: ChaseColor): Chase => {
  const chase = new Chase(name, color);

  const key = { [ChaseColor.RED]: 'r', [ChaseColor.BLUE]: 'b' }[color];

  chase.addStep(
    hex1.state({ master: 255, [key]: 255 }),
    hex2.state({ master: 0 }),
  );
  chase.addStep(
    hex1.state({ master: 0 }),
    hex2.state({ master: 255, [key]: 255 }),
  );

  return chase;
};
