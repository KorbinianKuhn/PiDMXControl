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

  data(stepIndex: number): Buffer {
    const data = Buffer.alloc(513, 0);
    const step = this.steps[stepIndex];

    for (const device of step) {
      for (const channel of device.channels) {
        data[channel.address] = channel.value;
      }
    }

    return data;
  }
}
