import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ColorService } from '../../../services/color.service';
import { ConfigService } from '../../../services/config.service';
import { MqttService } from '../../../services/mqtt.service';

@Component({
  selector: 'app-neopixel-strip',
  templateUrl: './neopixel-strip.component.html',
  styleUrls: ['./neopixel-strip.component.scss'],
})
export class NeopixelStripComponent implements OnInit, OnDestroy {
  @Input() id!: string;

  private destroy$$ = new Subject<void>();

  public pixels = new Array(25).fill('#000');

  private off = false;

  constructor(
    private mqttService: MqttService,
    private colorService: ColorService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    // this.mqttService.messages$
    //   .pipe(
    //     takeUntil(this.destroy$$),
    //     filter(({ deviceId }) => this.id === deviceId),
    //     throttleTime(environment.visualisationThrottleTime)
    //   )
    //   .subscribe(({ message }) => {
    //     this.updateColor(message);
    //   });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  updateColor(message: Buffer) {
    if (!this.configService.visualisation$.getValue()) {
      if (!this.off) {
        this.off = true;
        for (let i = 0; i < this.pixels.length; i++) {
          this.pixels[i] = '#000';
        }
      }
      return;
    }

    this.off = false;

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

      // r /= mergeLength;
      // g /= mergeLength;
      // b /= mergeLength;
      // w /= mergeLength;

      r = Math.min(r, 255);
      g = Math.min(g, 255);
      b = Math.min(b, 255);
      w = Math.min(w, 255);

      const index = Math.floor(i / mergeLength);

      this.pixels[index] = this.colorService.toRGB(255, r, g, b, w, 0, 0);
    }
  }
}
