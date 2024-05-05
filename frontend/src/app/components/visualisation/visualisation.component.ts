import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  Subject,
  animationFrameScheduler,
  combineLatest,
  filter,
  takeUntil,
  throttleTime,
} from 'rxjs';
import { ColorService } from '../../services/color.service';
import { ConfigService } from '../../services/config.service';
import { MqttService } from '../../services/mqtt.service';
import { WSService } from '../../services/ws.service';
import { BeamerComponent } from '../beamer/beamer.component';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss'],
  standalone: true,
  imports: [BeamerComponent],
})
export class VisualisationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  private destroy$$ = new Subject<void>();

  private bgColor = '#111827';

  constructor(
    private colorService: ColorService,
    private wsService: WSService,
    private mqttService: MqttService,
    private configService: ConfigService
  ) {}

  get context() {
    return this.canvas.nativeElement.getContext('2d', { alpha: false })!;
  }

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    this.context.scale(dpr, dpr);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    combineLatest([
      this.configService.visualisation$,
      this.mqttService.dmx$,
      this.mqttService.neopixel$,
    ])
      .pipe(
        takeUntil(this.destroy$$),
        filter(([visible, _, __]) => visible),
        throttleTime(0, animationFrameScheduler)
      )
      .subscribe(([_, dmx, neopixel]) => {
        this.redraw(dmx);
        this.redrawNeopixel(neopixel);
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  redraw(data: number[]) {
    this.updateHeroWash(0, 0, 114, data);
    this.updateHeroWash(300 - 40, 0, 130, data);

    this.updateLedPixBar(150 - 82, 50, 50, data);

    this.updateGigabarHex(8, 48, true, 1, data);
    this.updateGigabarHex(8, 120, true, 20, data);
    this.updateGigabarHex(300 - 32, 48, true, 10, data);
    this.updateGigabarHex(300 - 32, 120, true, 30, data);
    this.updateGigabarHex(150 - 32, 200 - 24, false, 40, data);

    this.updateSpot(150 - 48, 100, 108, data);
    this.updateDiamondDome(150 + 8, 110, 99, data);
  }

  redrawNeopixel(message: number[]) {
    this.updateNeopixelStrip(48, 20, message.slice(0, 150 * 4));
    this.updateNeopixelStrip(300 - 60, 20, message.slice(150 * 4, 2 * 150 * 4));
  }

  updateHeroWash(x: number, y: number, address: number, data: number[]) {
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

    const color = this.colorService.toRGB(master, r, g, b, w, a, uv);

    const ctx = this.context;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, 40, 40);

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x + 20, y + 20, 16, 0, 2 * Math.PI);
    ctx.fill();
  }

  updateGigabarHex(
    x: number,
    y: number,
    vertical: boolean,
    address: number,
    data: number[]
  ) {
    const [r, g, b, w, a, uv, master, strobe] = data.slice(
      address,
      address + 9
    );

    const radius = 8;
    const margin = 4;
    const width = radius * 6 + margin * 4;
    const height = radius * 2 + margin * 2;

    const color = this.colorService.toRGB(master, r, g, b, w, a, uv);

    const ctx = this.context;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, vertical ? height : width, vertical ? width : height);

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

  updateLedPixBar(x: number, y: number, address: number, data: number[]) {
    const ctx = this.context;

    const segmentWidth = 16;
    const segmentHeight = 8;
    const margin = 4;

    const width = segmentWidth * 8 + margin * 9;
    const height = segmentHeight + margin * 2;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, width, height);

    for (let i = 0; i < 8; i++) {
      const [master, strobe, r, g, b] = data.slice(
        address + i * 6,
        address + i * 6 + 6
      );
      const color = this.colorService.toRGB(master, r, g, b, 0, 0, 0);

      const posX = x + margin + i * (margin + segmentWidth);

      ctx.fillStyle = color;
      ctx.fillRect(posX, y + margin, segmentWidth, segmentHeight);
    }
  }

  updateDiamondDome(x: number, y: number, address: number, data: number[]) {
    const [r, g, b, w, a, uv, strobe, movement] = data.slice(
      address,
      address + 9
    );
    const color = this.colorService.toRGB(255, r, g, b, w, a, uv);

    const ctx = this.context;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, 40, 24);

    ctx.beginPath();
    ctx.arc(x + 20, y + 20, 16, 0, Math.PI, true);
    ctx.fillStyle = color;
    ctx.fill();
  }

  updateSpot(x: number, y: number, address: number, data: number[]) {
    const [strobe, r, g, b, w, master] = data.slice(address, address + 6);
    const color = this.colorService.toRGB(master, r, g, b, w, 0, 0);

    const ctx = this.context;

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(x, y, 40, 40);

    ctx.beginPath();
    ctx.arc(x + 20, y + 20, 16, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  updateNeopixelStrip(x: number, y: number, data: number[]) {
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
