import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';
import { ColorService } from '../../../services/color.service';
import { MqttService } from '../../../services/mqtt.service';

@Component({
  selector: 'app-neopixel-strip',
  templateUrl: './neopixel-strip.component.html',
  styleUrls: ['./neopixel-strip.component.scss'],
})
export class NeopixelStripComponent implements OnInit, OnDestroy {
  @Input() id!: string;

  private destroy$$ = new Subject<void>();

  public pixels = new Array(25).fill('rgba(0,0,0,1)');

  constructor(
    private mqttService: MqttService,
    private colorService: ColorService
  ) {}

  ngOnInit(): void {
    this.mqttService.messages$
      .pipe(
        takeUntil(this.destroy$$),
        filter(({ deviceId }) => this.id === deviceId)
      )
      .subscribe(({ message }) => {
        const numPixels = message.length / 4;
        const mergeLength = Math.floor(numPixels / this.pixels.length);

        for (let i = 0; i < numPixels; i++) {
          let r = 0,
            g = 0,
            b = 0,
            w = 0;

          for (let j = 0; j < mergeLength; j++) {
            r += message[i * 4 + j * 4];
            g += message[i * 4 + j * 4 + 1];
            b += message[i * 4 + j * 4 + 2];
            w += message[i * 4 + j * 4 + 3];
          }

          r = Math.min(r, 255);
          g = Math.min(g, 255);
          b = Math.min(b, 255);
          w = Math.min(w, 255);

          const index = Math.floor(i / mergeLength);

          this.pixels[index] = this.colorService.toRGB(255, r, g, b, w, 0, 0);
        }

        // const offset = numPixels / this.pixels.length;
        // for (let i = 0; i < this.pixels.length; i++) {
        //   const index = i * 4 * offset;
        //   const r = message[index];
        //   const g = message[index + 1];
        //   const b = message[index + 2];
        //   const w = message[index + 3];
        //   this.pixels[i] = `rgba(${r},${g},${b},1)`;
        // }
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }
}
