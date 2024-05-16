import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { LetDirective } from '@ngrx/component';
import { WSService } from '../../../services/ws.service';
import { PadButtonComponent } from '../../pad-button/pad-button.component';
import { PanelGroupComponent } from '../../panel-group/panel-group.component';
import { BpmNumberComponent } from '../bpm-number/bpm-number.component';

@Component({
  selector: 'app-bpm-modal',
  templateUrl: './bpm-modal.component.html',
  styleUrls: ['./bpm-modal.component.scss'],
  standalone: true,
  imports: [
    BpmNumberComponent,
    PadButtonComponent,
    MatSliderModule,
    LetDirective,
    PanelGroupComponent,
  ],
})
export class BpmModalComponent {
  private taps: number[] = [];
  private precision = 5;

  public bpm$ = this.wsService.bpm$;
  public presets = new Array(35).fill(null).map((_, i) => 110 + i);

  constructor(private wsService: WSService) {}

  onClickStart() {
    this.wsService.setStart();
  }

  onClickTap() {
    this.taps.push(Date.now());

    let ticks = [];

    if (this.taps.length >= 2) {
      for (let i = 0; i < this.taps.length; i++) {
        if (i >= 1) {
          // calc bpm between last two taps
          ticks.push(
            Math.round(
              (60 / (this.taps[i] / 1000 - this.taps[i - 1] / 1000)) * 100
            ) / 100
          );
        }
      }
    }

    if (this.taps.length >= 24) {
      this.taps.shift();
    }

    if (ticks.length >= 4) {
      let n = 0;

      for (let i = ticks.length - 1; i >= 0; i--) {
        n += ticks[i];
        if (ticks.length - i >= this.precision) break;
      }

      const bpm = Math.round((n / this.precision) * 2) / 2;
      this.wsService.setBpm(bpm);
    }
  }

  onClickTap2() {
    const now = Date.now();
    const length = this.taps.length;

    if (length === 0) {
      this.taps.push(now);
      return;
    }

    const latest = this.taps[length - 1];
    if (now - latest > 2000) {
      this.taps = [now];
      return;
    }

    if (length > 5) {
      this.taps.shift();
    }
    this.taps.push(now);

    let sum = 0;
    for (let i = 1; i < this.taps.length; i++) {
      sum += this.taps[i] - this.taps[i - 1];
    }

    const bpm = 60000 / (sum / (this.taps.length - 1));

    this.wsService.setBpm(bpm);
  }

  onSliderChange(event: any) {
    this.wsService.setBpm(event.value);
  }

  onChangeValue(amount: number) {
    this.wsService.setBpm(this.bpm$.getValue() + amount);
  }

  onClickRound() {
    this.wsService.setBpm(Math.round(this.bpm$.getValue()));
  }

  onClickPreset(bpm: number) {
    this.wsService.setBpm(bpm);
  }
}
