import {
  DmxChannelType,
  DmxDeviceState,
} from '../devices/dmx-device.interface';

export enum ChaseColor {
  RED = 'r',
  BLUE = 'b',
  GREEN = 'g',
  WHITE = 'w',
  AMBER = 'a',
  UV = 'uv',
}

export enum ChaseName {
  ON = 'on',
  MOODY = 'moody',
  DISCO = 'disco',
  CLUB = 'club',
  FLASHY = 'flashy',
}

export class Chase {
  private steps: Array<DmxDeviceState[]> = [];

  get length(): number {
    return this.steps.length;
  }

  get name(): string {
    return `${this.id}-${this.color}`;
  }

  constructor(public id: ChaseName, public color: ChaseColor) {}

  addStep(...devices: DmxDeviceState[]) {
    this.steps.push(devices);
  }

  data(stepIndex: number, master: number, strobe: boolean): Buffer {
    const data = Buffer.alloc(513, 0);
    const step = this.steps[stepIndex];

    for (const device of step) {
      for (const channel of device.channels) {
        if (channel.type === DmxChannelType.MASTER) {
          data[channel.address] = channel.value * (master / 100);
        } else {
          data[channel.address] = channel.value;
        }

        if (channel.type === DmxChannelType.STROBE && strobe) {
          data[channel.address] = 250;
        }
      }
    }

    return data;
  }
}
