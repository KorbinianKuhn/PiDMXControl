import {
  ChannelState,
  ChannelType,
  Device,
  DeviceStateValues,
} from '../lib/device';

const CHANNEL_ORDER: ChannelType[] = [
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  ChannelType.WHITE,
  ChannelType.AMBER,
  ChannelType.UV,
  ChannelType.MASTER,
  ChannelType.STROBE,
  null, // sound mode
];

export class VarytecGigabarHex extends Device {
  constructor(address: number, id: string) {
    super(address, id, CHANNEL_ORDER);
  }

  state(values: DeviceStateValues): ChannelState[] {
    const channels = this._cloneState();

    Object.keys(values).map((key) => {
      const value = values[key];
      switch (key) {
        case 'r':
          channels[0].value = value;
          break;
        case 'g':
          channels[1].value = value;
          break;
        case 'b':
          channels[2].value = value;
          break;
        case 'w':
          channels[3].value = value;
          break;
        case 'a':
          channels[4].value = value;
          break;
        case 'uv':
          channels[5].value = value;
          break;
        case 'master':
          channels[6].value = value;
          break;
        case 'strobe':
          channels[7].value = value;
          break;
      }
    });

    return channels;
  }
}
