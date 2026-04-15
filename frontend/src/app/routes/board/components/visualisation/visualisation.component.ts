import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  animationFrameScheduler,
  combineLatest,
  filter,
  interval,
  throttle,
  throttleTime,
} from 'rxjs';
import { ColorService } from '../../../../services/color.service';
import { ConfigService } from '../../../../services/config.service';
import { DeviceService } from '../../../../services/device.service';
import { MqttService } from '../../../../services/mqtt.service';
import { DeviceConfig } from '../../../../services/ws.interfaces';
import { BeamerComponent } from './beamer/beamer.component';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss'],
  imports: [BeamerComponent],
})
export class VisualisationComponent implements AfterViewInit {
  private colorService = inject(ColorService);
  private mqttService = inject(MqttService);
  private configService = inject(ConfigService);
  private destroyRef = inject(DestroyRef);
  private deviceService = inject(DeviceService);

  readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private bgColor = '#111827';

  protected readonly mqttConnected = this.mqttService.connected;
  protected readonly visualisation = this.configService.visualisation;
  protected readonly video = this.configService.video;

  protected showBeamer = computed(() => !this.deviceService.beamer()?.disabled);

  get context() {
    return this.canvas().nativeElement.getContext('2d', { alpha: false })!;
  }

  private interval = combineLatest([
    toObservable(this.configService.visualisation),
    toObservable(this.mqttService.visualisation),
    toObservable(this.mqttService.neopixelA),
    toObservable(this.mqttService.neopixelB),
  ]).pipe(
    filter(([visible]) => visible),
    throttle(() => interval(this.configService.performanceMode() ? 250 : 0)),
    throttleTime(0, animationFrameScheduler),
  );

  private draw = computed(() => {
    if (!this.deviceService.isReady()) {
      return [];
    }

    const methods: Array<
      (dmx: number[], neopixelA: number[], neopixelB: number[]) => void
    > = [];

    if (!this.deviceService.headLeft().disabled) {
      methods.push((data: number[]) =>
        this.updateHeroWash(0, 0, 114, data, this.deviceService.headLeft()),
      );
    }

    if (!this.deviceService.headRight().disabled) {
      methods.push((data: number[]) =>
        this.updateHeroWash(
          300 - 40,
          0,
          130,
          data,
          this.deviceService.headRight(),
        ),
      );
    }

    if (!this.deviceService.bar().disabled) {
      methods.push((data: number[]) =>
        this.updateLedPixBar(150 - 82, 50, 50, data, this.deviceService.bar()),
      );
    }

    const hex = this.deviceService.hex();
    if (!hex[0].disabled) {
      methods.push((data: number[]) =>
        this.updateGigabarHex(8, 48, true, 1, data, hex[0]),
      );
    }
    if (!hex[1].disabled) {
      methods.push((data: number[]) =>
        this.updateGigabarHex(8, 120, true, 20, data, hex[1]),
      );
    }
    if (!hex[2].disabled) {
      methods.push((data: number[]) =>
        this.updateGigabarHex(300 - 32, 48, true, 10, data, hex[2]),
      );
    }
    if (!hex[3].disabled) {
      methods.push((data: number[]) =>
        this.updateGigabarHex(300 - 32, 120, true, 30, data, hex[3]),
      );
    }
    if (!hex[4].disabled) {
      methods.push((data: number[]) =>
        this.updateGigabarHex(150 - 32, 200 - 24, false, 40, data, hex[4]),
      );
    }

    if (!this.deviceService.spot().disabled) {
      methods.push((data: number[]) =>
        this.updateSpot(150 - 48, 100, 108, data, this.deviceService.spot()),
      );
    }

    if (!this.deviceService.dome().disabled) {
      methods.push((data: number[]) =>
        this.updateDiamondDome(
          150 + 8,
          110,
          99,
          data,
          this.deviceService.dome(),
        ),
      );
    }

    const neopixel = this.deviceService.neopixel();
    if (!neopixel[0].disabled) {
      methods.push((_, neopixelA) =>
        this.updateNeopixelStrip(48, 20, neopixelA, neopixel[0]),
      );
    }
    if (!neopixel[1].disabled) {
      methods.push((_, __, neopixelB) =>
        this.updateNeopixelStrip(300 - 60, 20, neopixelB, neopixel[1]),
      );
    }

    return methods;
  });

  constructor() {
    effect(() => {
      const _ = this.draw();
      this.clear();
    });
  }

  ngAfterViewInit() {
    const canvas = this.canvas().nativeElement;
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    this.context.scale(dpr, dpr);
    this.context.save();

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    this.clear();

    this.interval
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([_, dmx, neopixelA, neopixelB]) => {
        for (const draw of this.draw()) {
          draw(dmx, neopixelA, neopixelB);
        }
      });
  }

  onClick() {
    this.configService.toggleVisualisation();
    this.clear();
  }

  onClickBeamer(event: MouseEvent) {
    event.stopPropagation();
    this.configService.toggleVideo();
  }

  clear() {
    this.context.clearRect(
      0,
      0,
      this.canvas().nativeElement.width,
      this.canvas().nativeElement.height,
    );
  }

  private strobeMultiplier(strobe: number) {
    if (strobe === 0 || strobe === 255) {
      return 1;
    }

    // Map strobe 0–255 → speed 0.02–1
    const minSpeed = 0.02; // minimum oscillation
    const maxSpeed = 1; // max oscillation
    const speed = minSpeed + (strobe / 255) * (maxSpeed - minSpeed);

    // Sine wave -1..1 → 0..1
    const phase = (Math.sin(Date.now() * speed * 0.05) + 1) / 2;

    // Use 50% threshold
    return phase > 0.5 ? 1 : 0;
  }

  private getOffset(
    value: number,
    valueMin: number,
    valueMax: number,
    flipped: boolean,
  ) {
    const clamped = Math.min(Math.max(value, valueMin), valueMax);
    const v = flipped ? valueMax - (clamped - valueMin) : clamped;

    const maxLeft = 10;
    const maxRight = 30;
    const middle = maxRight - maxLeft;

    const valueMiddle = (valueMin + valueMax) / 2;

    if (v <= valueMiddle) {
      return (
        maxLeft +
        ((v - valueMin) * (middle - maxLeft)) / (valueMiddle - valueMin)
      );
    } else {
      return (
        middle +
        ((v - valueMiddle) * (maxRight - middle)) / (valueMax - valueMiddle)
      );
    }
  }

  updateHeroWash(
    x: number,
    y: number,
    address: number,
    data: number[],
    config: DeviceConfig,
  ) {
    const ctx = this.context;

    // Clear area
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, 40, 40);

    const [
      pan,
      panFine,
      tilt,
      tiltFine,
      speed,
      master,
      strobe,
      r,
      g,
      b,
      w,
      a,
      uv,
    ] = data.slice(address, address + 16);

    const masterWithStrobe = this.strobeMultiplier(strobe) * master;
    const color = this.colorService.toRGB(masterWithStrobe, r, g, b, w, a, uv);

    // Draw static
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y + 34, 40, 6);
    ctx.fillRect(x + 12, y + 20, 16, 20);

    const xOffset = this.getOffset(
      pan,
      config.minPan ?? 0,
      config.maxPan ?? 0,
      config.flipped ?? false,
    );
    const yOffset = this.getOffset(
      tilt,
      config.minTilt ?? 0,
      config.maxTilt ?? 0,
      true,
    );

    // Draw color
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + xOffset, y + yOffset, 8, 0, 2 * Math.PI);
    ctx.fill();
  }

  updateGigabarHex(
    x: number,
    y: number,
    vertical: boolean,
    address: number,
    data: number[],
    config: DeviceConfig,
  ) {
    const radius = 8;
    const margin = 4;
    const width = radius * 6 + margin * 4;
    const height = radius * 2 + margin * 2;

    const ctx = this.context;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, vertical ? height : width, vertical ? width : height);

    const [r, g, b, w, a, uv, master, strobe] = data.slice(
      address,
      address + 9,
    );
    const masterWithStrobe = this.strobeMultiplier(strobe) * master;
    const color = this.colorService.toRGB(masterWithStrobe, r, g, b, w, a, uv);

    ctx.fillStyle = color;

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();

      let posX = 0;
      let posY = 0;
      if (vertical) {
        posX = x + margin + radius;
        posY = y + (i + 1) * (radius * 2 + margin) - radius;
      } else {
        posX = x + (i + 1) * (radius * 2 + margin) - radius;
        posY = y + margin + radius;
      }

      ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  updateLedPixBar(
    x: number,
    y: number,
    address: number,
    data: number[],
    config: DeviceConfig,
  ) {
    const ctx = this.context;

    const segmentWidth = 16;
    const segmentHeight = 8;
    const margin = 4;

    const width = segmentWidth * 8 + margin * 9;
    const height = segmentHeight + margin * 2;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, width, height);

    let strobeMultiplier = 1;
    for (let i = 0; i < 8; i++) {
      const [master, strobe, r, g, b] = data.slice(
        address + i * 6,
        address + i * 6 + 6,
      );

      if (i === 0) {
        strobeMultiplier = this.strobeMultiplier(strobe);
      }

      const color = this.colorService.toRGB(
        master * strobeMultiplier,
        r,
        g,
        b,
        0,
        0,
        0,
      );

      const posX = x + margin + i * (margin + segmentWidth);

      ctx.fillStyle = color;
      ctx.fillRect(posX, y + margin, segmentWidth, segmentHeight);
    }
  }

  updateDiamondDome(
    x: number,
    y: number,
    address: number,
    data: number[],
    config: DeviceConfig,
  ) {
    const ctx = this.context;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, 40, 24);

    const [r, g, b, w, a, uv, strobe, movement] = data.slice(
      address,
      address + 9,
    );
    const strobeMultiplier = this.strobeMultiplier(strobe);
    const color = this.colorService.toRGB(
      255,
      r * strobeMultiplier,
      g * strobeMultiplier,
      b * strobeMultiplier,
      w * strobeMultiplier,
      a * strobeMultiplier,
      uv * strobeMultiplier,
    );

    ctx.beginPath();
    ctx.arc(x + 20, y + 20, 16, 0, Math.PI, true);
    ctx.fillStyle = color;
    ctx.fill();
  }

  updateSpot(
    x: number,
    y: number,
    address: number,
    data: number[],
    config: DeviceConfig,
  ) {
    const ctx = this.context;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, 40, 40);

    const [strobe, r, g, b, w, master] = data.slice(address, address + 6);
    const masterWithStrobe = this.strobeMultiplier(strobe) * master;
    const color = this.colorService.toRGB(masterWithStrobe, r, g, b, w, 0, 0);

    ctx.beginPath();
    ctx.arc(x + 20, y + 20, 16, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  updateNeopixelStrip(
    x: number,
    y: number,
    data: number[],
    config: DeviceConfig,
  ) {
    const ctx = this.context;

    const numPixels = data.length / 4;
    const margin = 4;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, 4 + margin * 2, numPixels + margin * 2);

    for (let i = 0; i < numPixels; i += 4) {
      const pixels = data.slice(i * 4, i * 4 + 16);

      const r = Math.min(pixels[0] + pixels[4] + pixels[8] + pixels[12], 255);
      const g = Math.min(pixels[1] + pixels[5] + pixels[9] + pixels[13], 255);
      const b = Math.min(pixels[2] + pixels[6] + pixels[10] + pixels[14], 255);
      const w = Math.min(pixels[3] + pixels[7] + pixels[11] + pixels[15], 255);

      const color = this.colorService.toRGB(255, r, g, b, w, 0, 0);

      ctx.fillStyle = color;
      ctx.fillRect(x + margin, y + margin + i, 4, 4);
    }
  }
}
