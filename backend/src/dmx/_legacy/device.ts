export interface ChannelSetting {
  channel: number;
  value: number;
}

export abstract class Device {
  abstract channels: number[];

  constructor(private address: number) {}

  abstract red(value: number): this;
  abstract green(value: number): this;
  abstract blue(value: number): this;
  abstract white(value: number): this;
  abstract amber(value: number): this;
  abstract uv(value: number): this;

  abstract black(): this;
  abstract master(value: number): this;
  abstract strobe(value: number): this;

  rgb(r: number, g: number, b: number) {
    this.black();
    this.red(r);
    this.blue(b);
    this.green(g);
  }

  reset() {
    for (let i = 0; i < this.channels.length; i++) {
      this.channels[i] = 0;
    }
    return this;
  }

  snapshot(): ChannelSetting[] {
    return this.channels.map((value, i) => ({
      channel: i + this.address,
      value,
    }));
  }
}
