import { DmxDeviceState } from '../devices/dmx-device.interface';

export enum ChaseColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  WHITE = 'white',
}

export class Chase {
  private steps: Array<DmxDeviceState[]> = [];

  get length(): number {
    return this.steps.length;
  }

  get name(): string {
    return `${this.id}-${this.color}`;
  }

  constructor(public id: string, public color: ChaseColor) {}

  addStep(...devices: DmxDeviceState[]) {
    this.steps.push(devices);
  }

  createAnimation() {}
}
