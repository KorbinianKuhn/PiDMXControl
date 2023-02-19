export enum DmxChannelType {
  MASTER = 'master',
  STROBE = 'strobe',
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  WHITE = 'white',
  AMBER = 'amber',
  UV = 'uv',
  OTHER = 'other',
}

export interface DmxChannel {
  address: number;
  type: DmxChannelType;
  value: number;
  min: number;
  max: number;
}

export interface DmxChannelStateValues {
  r?: number;
  g?: number;
  b?: number;
  w?: number;
  a?: number;
  uv?: number;
  master?: number;
  strobe?: number;
}

export interface DmxDeviceState {
  device: DmxDevice;
  channels: DmxChannel[];
}

export abstract class DmxDevice {
  public channels: DmxChannel[];

  constructor(public address: number, public id: string) {}

  _cloneState(): DmxChannel[] {
    return this.channels.map((o) => ({ ...o }));
  }
}
