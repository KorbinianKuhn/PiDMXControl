import { AdjSaberSpot } from '../devices/adj-saber-spot';
import { EuroliteLedPixBar } from '../devices/eurolite-led-pix-bar';
import { FunGenerationLedDiamondDome } from '../devices/fun-generation-led-diamond-dome';
import { VarytecGigabarHex } from '../devices/varytec-gigabar-hex';
import { VarytecHeroWash } from '../devices/varytec-hero-wash';
import { ChannelType, COLOR_CHANNELS } from './device';

export class DeviceRegistry {
  public masterChannels: number[] = [];
  public ambientUVChannels: number[] = [];
  public ambientUVMasterChannels: number[] = [];

  private hex1 = new VarytecGigabarHex(1, 'hex-1');
  private hex2 = new VarytecGigabarHex(10, 'hex-2');
  private hex3 = new VarytecGigabarHex(20, 'hex-3');
  private hex4 = new VarytecGigabarHex(30, 'hex-4');
  private hex5 = new VarytecGigabarHex(40, 'hex-5');
  private bar = new EuroliteLedPixBar(50, 'bar');
  private dome = new FunGenerationLedDiamondDome(99, 'dome');
  private spot = new AdjSaberSpot(108, 'spot');
  private headLeft = new VarytecHeroWash(114, 'head-left');
  private headRight = new VarytecHeroWash(130, 'head-right');

  private devices = [
    this.hex1,
    this.hex2,
    this.hex3,
    this.hex4,
    this.hex5,
    this.bar,
    this.dome,
    this.spot,
    this.headLeft,
    this.headRight,
  ];

  constructor() {
    for (const device of this.devices) {
      if (device instanceof FunGenerationLedDiamondDome) {
        this.masterChannels.push(
          ...device.channels
            .filter((o) => COLOR_CHANNELS.includes(o.type))
            .map((o) => o.address),
        );
      } else {
        this.masterChannels.push(
          ...device.channels
            .filter((o) => o.type === ChannelType.MASTER)
            .map((o) => o.address),
        );
      }

      if (device instanceof VarytecGigabarHex) {
        this.ambientUVChannels.push(
          ...device.channels
            .filter((o) => o.type === ChannelType.UV)
            .map((o) => o.address),
        );
        this.ambientUVMasterChannels.push(
          ...device.channels
            .filter((o) => o.type === ChannelType.MASTER)
            .map((o) => o.address),
        );
      }
    }
  }

  list() {
    return this.devices;
  }

  object() {
    return {
      hex: {
        a: this.hex1,
        b: this.hex2,
        c: this.hex3,
        d: this.hex4,
        e: this.hex5,
        all: [this.hex1, this.hex2, this.hex3, this.hex4, this.hex5],
      },
      bar: this.bar,
      dome: this.dome,
      spot: this.spot,
      head: {
        left: this.headLeft,
        right: this.headRight,
        all: [this.headLeft, this.headRight],
      },
    };
  }
}
