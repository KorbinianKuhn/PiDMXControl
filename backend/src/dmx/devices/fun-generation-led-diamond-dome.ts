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
  ChannelType.STROBE,
  ChannelType.MOVEMENT,
  null, // sound mode
];

export class FunGenerationLedDiamondDome extends Device {
  public strobeMin = 10;
  public strobeMax = 255;

  constructor(address: number, id: string) {
    super(address, id, CHANNEL_ORDER);
  }

  state(values: DeviceStateValues): ChannelState[] {
    const channels = this._cloneState();

    const sortedKeys = Object.keys(values).sort(
      (a, b) => (a === 'master' ? 0 : 1) - (b === 'master' ? 0 : 1),
    );

    sortedKeys.map((key) => {
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
          for (let i = 0; i < 6; i++) {
            channels[i].value *= value;
          }
          break;
        case 'strobe':
          channels[6].value = this._normalizeStrobeValue(value);
          break;
        case 'movement':
          channels[7].value = value;
          break;
      }
    });

    return channels;
  }
}
