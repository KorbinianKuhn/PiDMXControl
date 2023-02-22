import {
  ChannelState,
  ChannelType,
  Device,
  DeviceStateValues,
} from '../lib/device';

const SEGMENT_CHANNEL_ORDER: ChannelType[] = [
  ChannelType.MASTER,
  ChannelType.STROBE,
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  null,
];

const CHANNEL_ORDER = new Array(6 * 8)
  .fill(null)
  .map((o, i) => SEGMENT_CHANNEL_ORDER[i % 6]);

type SegmentSelection = number | number[] | 'even' | 'odd' | 'all';

interface SegmentStateValues extends DeviceStateValues {
  segments: SegmentSelection;
}

export class EuroliteLedPixBar extends Device {
  constructor(address: number, id: string) {
    super(address, id, CHANNEL_ORDER);
  }

  state(...chunks: SegmentStateValues[]): ChannelState[] {
    const channels = this._cloneState();

    for (const chunk of chunks) {
      const { segments, ...values } = chunk;
      const indexes = this._getSegmentIndexes(segments);
      for (const index of indexes) {
        const offset = SEGMENT_CHANNEL_ORDER.length * index;
        this._setChannels(channels, offset, values);
      }
    }

    return channels;
  }

  _getSegmentIndexes(selection: SegmentSelection): number[] {
    if (selection === 'even') {
      return [0, 2, 4, 6];
    }

    if (selection === 'odd') {
      return [1, 3, 5, 7];
    }

    if (selection === 'all') {
      return [0, 1, 2, 3, 4, 5, 6, 7];
    }

    if (Array.isArray(selection)) {
      return selection;
    }

    return [selection];
  }

  _setChannels(
    channels: ChannelState[],
    offset: number,
    values: DeviceStateValues,
  ): void {
    Object.keys(values).map((key) => {
      const value = values[key];
      switch (key) {
        case 'r':
          channels[2 + offset].value = value;
          break;
        case 'g':
          channels[3 + offset].value = value;
          break;
        case 'b':
          channels[4 + offset].value = value;
          break;
        case 'w':
          channels[2 + offset].value = value;
          channels[3 + offset].value = value;
          channels[4 + offset].value = value;
          break;
        case 'a': {
          const factor = value / 255;
          channels[2 + offset].value = 200 * factor;
          channels[3 + offset].value = 100 * factor;
          break;
        }
        case 'uv': {
          const factor = value / 255;
          channels[2 + offset].value = 50 * factor;
          channels[4 + offset].value = value;
          break;
        }
        case 'master':
          channels[0 + offset].value = value;
          break;
        case 'strobe':
          channels[1 + offset].value = value;
          break;
      }
    });
  }
}
