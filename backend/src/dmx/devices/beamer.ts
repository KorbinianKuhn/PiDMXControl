import { Config } from '../lib/config';
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
  ChannelType.MASTER,
  ChannelType.STROBE,
];

export class Beamer extends Device {
  constructor(address: number, id: string, config: Config) {
    super(address, id, CHANNEL_ORDER, config);
  }

  state(values: DeviceStateValues): ChannelState[] {
    const channels = this._cloneState();

    Object.keys(values).map((key) => {
      const value = values[key];
      switch (key) {
        case 'r':
          channels[0].value += value;
          break;
        case 'g':
          channels[1].value += value;
          break;
        case 'b':
          channels[2].value += value;
          break;
        case 'w':
          channels[0].value += value;
          channels[1].value += value;
          channels[2].value += value;
          break;
        case 'a': {
          const factor = value / 255;
          channels[0].value += 255 * factor;
          channels[1].value += 64 * factor;
          break;
        }
        case 'uv': {
          const factor = value / 255;
          channels[0].value += 64 * factor;
          channels[2].value += 127 * factor;
          break;
        }
        case 'master':
          channels[3].value = value;
          break;
        case 'strobe':
          channels[4].value = value;
          break;
      }
    });

    return channels;
  }
}
