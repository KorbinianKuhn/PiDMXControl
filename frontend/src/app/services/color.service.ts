import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  constructor() {}

  getStrobeClasses(
    strobe: number,
    min: number,
    max: number
  ): { classes: string; duration: string } {
    if (strobe === 0) {
      return {
        classes: '',
        duration: '0',
      };
    }

    const value = strobe / (max - min);
    const ms = 50 / value;

    let speed = 'slow';
    if (ms < 100) {
      speed = 'fast';
    } else if (ms < 200) {
      speed = 'middle';
    }

    return {
      classes: `strobe ${speed}`,
      duration: `${ms}ms`,
    };
  }

  toRGB(
    master: number,
    r: number,
    g: number,
    b: number,
    w: number,
    a: number,
    uv: number
  ): string {
    if (master === 0) {
      return '#000';
    }

    let red = r;
    let green = g;
    let blue = b;

    if (w) {
      red += w;
      green += w;
      blue += w;
    }

    if (a) {
      const factor = a / 255;
      red += 255 * factor;
      green += 174 * factor;
    }

    if (uv) {
      const factor = uv / 255;
      red += 127 * factor;
      blue += 255 * factor;
    }

    return `rgba(${Math.min(red, 255)},${Math.min(green, 255)},${Math.min(
      blue,
      255
    )}, ${master / 255})`;
  }
}
