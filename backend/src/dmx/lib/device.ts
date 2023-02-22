export enum ChannelType {
  MASTER = 'master',
  STROBE = 'strobe',
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  WHITE = 'white',
  AMBER = 'amber',
  UV = 'uv',
  OTHER = 'other',
  MOVEMENT = 'movement',
}

export const COLOR_CHANNELS = [
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  ChannelType.WHITE,
  ChannelType.AMBER,
  ChannelType.UV,
];

export interface DeviceChannel {
  address: number;
  type: ChannelType;
  value: number;
  min: number;
  max: number;
}

export interface DeviceStateValues {
  r?: number;
  g?: number;
  b?: number;
  w?: number;
  a?: number;
  uv?: number;
  master?: number;
  strobe?: number;
}

export interface ChannelState {
  address: number;
  value: number;
}

export abstract class Device {
  public channels: DeviceChannel[];

  public strobeMin = 0;
  public strobeMax = 255;

  constructor(public address: number, public id: string, order: ChannelType[]) {
    this.channels = order.map((type, i) => ({
      address: this.address + i,
      type,
      value: 0,
      min: type === ChannelType.STROBE ? this.strobeMin : 0,
      max: type === ChannelType.STROBE ? this.strobeMax : 255,
    }));
  }

  _cloneState(): ChannelState[] {
    return this.channels.map((o) => ({ address: o.address, value: o.value }));
  }

  _normalizeStrobeValue(value: number): number {
    const steps = value / 255;
    return (this.strobeMax - this.strobeMin) * steps + this.strobeMin;
  }
}
