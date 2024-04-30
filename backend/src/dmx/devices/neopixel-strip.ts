import { DeviceStateValues } from '../lib/device';

interface RGBW {
  r: number;
  g: number;
  b: number;
  w: number;
}

export class NeopixelStrip {
  get length(): number {
    return this.numPixels;
  }

  constructor(private numPixels: number) {}

  clear(): number[] {
    return this.empty();
  }

  empty(): number[] {
    return Array(this.numPixels * 4).fill(0);
  }

  setPixel(index: number, values: DeviceStateValues): number[] {
    const pixels = this.empty();
    const { r, g, b, w } = this.getRGBWFromValues(values);

    pixels[index * 4] = r;
    pixels[index * 4 + 1] = g;
    pixels[index * 4 + 2] = b;
    pixels[index * 4 + 3] = w;

    return pixels;
  }

  setRange(start: number, end: number, values: DeviceStateValues): number[] {
    const pixels = this.empty();
    const { r, g, b, w } = this.getRGBWFromValues(values);

    for (let i = start; i < end; i++) {
      pixels[i * 4] = r;
      pixels[i * 4 + 1] = g;
      pixels[i * 4 + 2] = b;
      pixels[i * 4 + 3] = w;
    }

    return pixels;
  }

  setMultiple(
    pixels: Array<{ index: number; values: DeviceStateValues }>,
  ): number[] {
    const state = this.empty();

    for (const pixel of pixels) {
      const { r, g, b, w } = this.getRGBWFromValues(pixel.values);
      state[pixel.index * 4] = r;
      state[pixel.index * 4 + 1] = g;
      state[pixel.index * 4 + 2] = b;
      state[pixel.index * 4 + 3] = w;
    }

    return state;
  }

  setAll(values: DeviceStateValues): number[] {
    const pixels = this.empty();
    const { r, g, b, w } = this.getRGBWFromValues(values);

    for (let i = 0; i < this.numPixels; i++) {
      pixels[i * 4] = r;
      pixels[i * 4 + 1] = g;
      pixels[i * 4 + 2] = b;
      pixels[i * 4 + 3] = w;
    }

    return pixels;
  }

  private getRGBWFromValues(values: DeviceStateValues) {
    let r = 0;
    let g = 0;
    let b = 0;
    let w = 0;

    if (values.r) {
      r += values.r;
    }

    if (values.g) {
      g += values.g;
    }

    if (values.b) {
      b += values.b;
    }

    if (values.w) {
      w += values.w;
    }

    if (values.a) {
      const factor = values.a / 255;
      r += 255 * factor;
      g += 64 * factor;
    }

    if (values.uv) {
      const factor = values.uv / 255;
      r += 64 * factor;
      b += 127 * factor;
    }

    if (values.master) {
      const multiplier = values.master / 255;
      r *= multiplier;
      g *= multiplier;
      b *= multiplier;
      w *= multiplier;
    }

    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    w = Math.floor(w);

    // TODO: optimize for energy

    return { r, g, b, w };
  }
}
