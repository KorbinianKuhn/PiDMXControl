import { AdjSaberSpot } from '../devices/adj-saber-spot';
import { Beamer } from '../devices/beamer';
import { EuroliteLedPixBar } from '../devices/eurolite-led-pix-bar';
import { FunGenerationLedDiamondDome } from '../devices/fun-generation-led-diamond-dome';
import { NeopixelStrip } from '../devices/neopixel-strip';
import { VarytecGigabarHex } from '../devices/varytec-gigabar-hex';
import { VarytecHeroWash } from '../devices/varytec-hero-wash';
import { Config } from './config';
import { ChannelType, COLOR_CHANNELS } from './device';

export class DeviceRegistry {
  public masterChannels: Array<{
    deviceId: string;
    channels: number[];
  }> = [];
  public ambientUVChannels: number[] = [];
  public ambientUVMasterChannels: number[] = [];

  private hex1 = new VarytecGigabarHex(1, 'hex-1', this.config);
  private hex2 = new VarytecGigabarHex(10, 'hex-2', this.config);
  private hex3 = new VarytecGigabarHex(20, 'hex-3', this.config);
  private hex4 = new VarytecGigabarHex(30, 'hex-4', this.config);
  private hex5 = new VarytecGigabarHex(40, 'hex-5', this.config);
  private bar = new EuroliteLedPixBar(50, 'bar', this.config);
  private dome = new FunGenerationLedDiamondDome(99, 'dome', this.config);
  private spot = new AdjSaberSpot(108, 'spot', this.config);
  private headLeft = new VarytecHeroWash(114, 'head-left', this.config);
  private headRight = new VarytecHeroWash(130, 'head-right', this.config);
  private beamer = new Beamer(146, 'beamer', this.config);
  private neopixelA = new NeopixelStrip('neopixel-a', 150, this.config);
  private neopixelB = new NeopixelStrip('neopixel-b', 150, this.config);

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
    this.beamer,
    this.neopixelA,
    this.neopixelB,
  ];

  constructor(private config: Config) {
    for (const device of this.devices) {
      if (device instanceof NeopixelStrip) {
        continue;
      }

      if (device instanceof FunGenerationLedDiamondDome) {
        this.masterChannels.push({
          deviceId: device.id,
          channels: device.channels
            .filter((o) => COLOR_CHANNELS.includes(o.type))
            .map((o) => o.address),
        });
      } else {
        this.masterChannels.push({
          deviceId: device.id,
          channels: device.channels
            .filter((o) => o.type === ChannelType.MASTER)
            .map((o) => o.address),
        });
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

    this.config.registerDevices(this.devices);
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
      beamer: this.beamer,
      neopixelA: this.neopixelA,
      neopixelB: this.neopixelB,
    };
  }
}
