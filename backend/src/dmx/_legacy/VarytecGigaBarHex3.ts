import { Device } from '../../src/device';

enum Channel {
  RED,
  GREEN,
  BLUE,
  WHITE,
  AMBER,
  UV,
  MASTER,
  STROBE,
}

export class VarytecGigabarHex3 extends Device {
  public channels: number[] = [
    0, // R
    0, // G
    0, // B
    0, // W
    0, // A
    0, // UV,
    0, // Master,
    0, // Strobe,
  ];

  constructor(address: number) {
    super(address);
  }

  red(value: number) {
    this.channels[Channel.RED] = value;
    return this;
  }

  green(value: number) {
    this.channels[Channel.GREEN] = value;
    return this;
  }

  blue(value: number) {
    this.channels[Channel.BLUE] = value;
    return this;
  }

  white(value: number) {
    this.channels[Channel.WHITE] = value;
    return this;
  }

  amber(value: number) {
    this.channels[Channel.AMBER] = value;
    return this;
  }

  uv(value: number) {
    this.channels[Channel.UV] = value;
    return this;
  }

  black() {
    for (let i = 0; i < 6; i++) {
      this.channels[i] = 0;
    }
    return this;
  }

  master(value: number) {
    this.channels[Channel.MASTER] = value;
    return this;
  }

  strobe(value: number) {
    this.channels[Channel.STROBE] = value;
    return this;
  }
}
