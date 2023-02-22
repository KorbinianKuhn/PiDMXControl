import {
  ChannelState,
  ChannelType,
  Device,
  DeviceStateValues,
} from '../lib/device';

const CHANNEL_ORDER: ChannelType[] = [
  null, //pan
  null, // pan fine
  null, // tilt
  null, // tilt fine
  null, // speed pan tilt
  ChannelType.MASTER,
  ChannelType.STROBE, // 10-250
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  ChannelType.WHITE,
  ChannelType.AMBER,
  ChannelType.UV,
  null, // color temperature
  null, // color macros
  null, // auto programs
];

export class VarytecHeroWash extends Device {
  constructor(address: number, id: string) {
    super(address, id, CHANNEL_ORDER);
  }

  state(values: DeviceStateValues): ChannelState[] {
    const channels = this._cloneState();

    Object.keys(values).map((key) => {
      const value = values[key];
      switch (key) {
        case 'r':
          channels[7].value = value;
          break;
        case 'g':
          channels[8].value = value;
          break;
        case 'b':
          channels[9].value = value;
          break;
        case 'w':
          channels[10].value = value;
          break;
        case 'a':
          channels[11].value = value;
          break;
        case 'uv':
          channels[12].value = value;
          break;
        case 'master':
          channels[5].value = value;
          break;
        case 'strobe':
          channels[6].value = this._normalizeStrobeValue(value);
          break;
      }
    });

    return channels;
  }
}
