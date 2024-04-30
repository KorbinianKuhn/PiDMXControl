import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WSService } from '../../../services/ws.service';
import { MatSliderModule } from '@angular/material/slider';
import { PadButtonComponent } from '../../pad-button/pad-button.component';
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
    ],
})
export class BpmModalComponent implements OnInit, OnDestroy {
  private taps: number[] = [];
  private destroy$$ = new Subject<void>();

  public bpm: number = this.wsService.bpm$.getValue();

  constructor(private wsService: WSService) {}

  ngOnInit(): void {
    this.wsService.bpm$
      .pipe(takeUntil(this.destroy$$))
      .subscribe((value) => (this.bpm = value));
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  onClickStart() {
    this.wsService.setStart();
  }

  onClickTap() {
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
}
