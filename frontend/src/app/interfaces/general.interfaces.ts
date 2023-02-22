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

export interface Device {
  channels: ChannelType[];
  name: string;
  address: number;
}
