import {
  DmxChannelStateValues,
  DmxChannelType,
  DmxDevice,
  DmxDeviceState,
} from './dmx-device.interface';

const CHANNEL_ORDER: DmxChannelType[] = [
  DmxChannelType.RED,
  DmxChannelType.GREEN,
  DmxChannelType.BLUE,
  DmxChannelType.WHITE,
  DmxChannelType.AMBER,
  DmxChannelType.UV,
  DmxChannelType.MASTER,
  DmxChannelType.STROBE,
];

export class VarytecGigabarHex extends DmxDevice {
  constructor(address: number, id: string) {
    super(address, id);

    this.channels = CHANNEL_ORDER.map((type, i) => ({
      address: address + i,
      type,
      value: 0,
      min: 0,
      max: 255,
    }));
  }

  state(values: DmxChannelStateValues): DmxDeviceState {
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

    return { device: this, channels };
  }
}
