import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatSlider,
  MatSliderDragEvent,
  MatSliderThumb,
} from '@angular/material/slider';
import { PadButtonComponent } from '../../../../../components/pad-button/pad-button.component';
import { PanelGroupComponent } from '../../../../../components/panel-group/panel-group.component';
import { WSService } from '../../../../../services/ws.service';
import { BpmNumberComponent } from '../bpm-number/bpm-number.component';

@Component({
  selector: 'app-bpm-modal',
  templateUrl: './bpm-modal.component.html',
  styleUrls: ['./bpm-modal.component.scss'],
  imports: [
    BpmNumberComponent,
    PadButtonComponent,
    MatSlider,
    MatSliderThumb,
    PanelGroupComponent,
  ],
})
export class BpmModalComponent {
  private wsService = inject(WSService);
  private dialogRef = inject(MatDialogRef<BpmModalComponent>);

  private taps: number[] = [];

  protected readonly bpm = this.wsService.bpm;
  protected readonly presets = [70, 90, 110, 120, 128, 135, 140, 145, 150, 160];

  onClickStart() {
    this.wsService.setStart();
  }

  onClickTap() {
    const now = performance.now();

    // Reset on pause
    if (this.taps.length && now - this.taps.at(-1)! > 2000) {
      this.taps = [];
    }

    this.taps.push(now);

    if (this.taps.length > 12) {
      this.taps.shift();
    }

    if (this.taps.length < 2) return;

    const intervals = this.taps
      .slice(1)
      .map((o, i) => o - this.taps[i])
      .filter((i) => i > 100 && i < 2000); // guard

    if (intervals.length === 0) return;

    // focus on recent taps only (more responsive)
    const recent = intervals.slice(-6);

    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;

    // outlier rejection
    const filtered = recent.filter((i) => Math.abs(i - avg) < avg * 0.2);
    const safe = filtered.length ? filtered : recent;

    const finalAvg = safe.reduce((a, b) => a + b, 0) / safe.length;

    const bpm = 60000 / finalAvg;

    const roundedBpm = Math.round(bpm);

    this.wsService.setBpm(roundedBpm);
  }

  onSliderChange(event: MatSliderDragEvent) {
    this.wsService.setBpm(event.value);
  }

  onChangeValue(amount: number) {
    this.wsService.setBpm(this.bpm() + amount);
  }

  onClickRound() {
    this.wsService.setBpm(Math.round(this.bpm()));
  }

  onClickPreset(bpm: number) {
    this.wsService.setBpm(bpm);
    this.dialogRef.close();
  }
}
