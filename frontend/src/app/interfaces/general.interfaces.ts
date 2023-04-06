export enum ChannelType {
  MASTER = 'master',
  STROBE = 'strobe',
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  WHITE = 'white',
  AMBER = 'amber',
  UV = 'uv',
  MOVEMENT = 'movement',
  PAN = 'pan',
  PAN_FINE = 'pan-fine',
  TILT = 'tilt',
  TILT_FINE = 'tilt-fine',
  SPEED = 'speed',
  SOUND_MODE = 'sound-mode',
  AUTO = 'auto',
  COLOR_MACRO = 'color-macro',
  COLOR_TEMPERATURE = 'color-temperature',
  OTHER = 'other',
}

export interface Device {
  channels: ChannelType[];
  name: string;
  address: number;
}
