import { Component } from '@angular/core';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-bpm-modal',
  templateUrl: './bpm-modal.component.html',
  styleUrls: ['./bpm-modal.component.scss'],
})
export class BpmModalComponent {
  private taps: number[] = [];

  constructor(private wsService: WSService) {}

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
}
