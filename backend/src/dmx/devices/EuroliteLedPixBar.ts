import {
  DmxChannel,
  DmxChannelStateValues,
  DmxChannelType,
  DmxDevice,
  DmxDeviceState,
} from './dmx-device.interface';

const SEGMENT_CHANNEL_ORDER: DmxChannelType[] = [
  DmxChannelType.MASTER,
  DmxChannelType.STROBE,
  DmxChannelType.RED,
  DmxChannelType.GREEN,
  DmxChannelType.BLUE,
  null,
];

export class EuroliteLedPixBar extends DmxDevice {
  constructor(address: number, id: string) {
    super(address, id);

    this.channels = [];

    for (let i = 0; i < 8; i++) {
      const offset = SEGMENT_CHANNEL_ORDER.length * i;
      this.channels.push(
        ...SEGMENT_CHANNEL_ORDER.map((type, i2) => ({
          address: address + offset + i2,
          type,
          value: 0,
          min: 0,
          max: 255,
        })),
      );
    }
  }

  state(
    segments: Array<{
      index: number | number[] | 'even' | 'odd' | 'all';
      values: DmxChannelStateValues;
    }>,
  ): DmxDeviceState {
    const channels = this._cloneState();

    for (const segment of segments) {
      let indexes = [];
      if (segment.index === 'even') {
        indexes = [0, 2, 4, 6];
      } else if (segment.index === 'odd') {
        indexes = [1, 3, 5, 7];
      } else if (segment.index === 'all') {
        indexes = [0, 1, 2, 3, 4, 5, 6, 7];
      } else if (Array.isArray(segment.index)) {
        indexes = segment.index;
      } else {
        indexes = [segment.index];
      }

      for (const index of indexes) {
        const offset = SEGMENT_CHANNEL_ORDER.length * index;
        this._setChannels(channels, offset, segment.values);
      }
    }

    return { device: this, channels };
  }

  _setChannels(
    channels: DmxChannel[],
    offset: number,
    values: DmxChannelStateValues,
  ): void {
    console.log(channels.length, offset);
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
        case 'a':
          channels[2 + offset].value = value;
          channels[3 + offset].value = Math.round(value / 100);
          break;
        case 'uv':
          channels[2 + offset].value = Math.round(value / 100);
          channels[4 + offset].value = value;
          break;
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
