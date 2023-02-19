import { hex1, hex2 } from '../devices/devices';
import { Chase, ChaseColor } from './chase';

export const createMoodyChase = (name: string, color: ChaseColor): Chase => {
  const chase = new Chase(name, color);

  chase.addStep(hex1.state({ r: 255 }), hex2.state({ r: 0 }));
  chase.addStep(hex1.state({ r: 0 }), hex2.state({ r: 255 }));

  return chase;
};
