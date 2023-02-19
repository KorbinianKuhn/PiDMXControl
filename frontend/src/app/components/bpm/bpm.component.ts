import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subject } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-bpm',
  templateUrl: './bpm.component.html',
  styleUrls: ['./bpm.component.scss'],
})
export class BpmComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();

  public bars$ = this.configService.clock$.pipe(
    map((value) => {
      const values = [false, false, false, false];
      values[value] = true;
      return values;
    })
  );

  public bpm$ = this.wsService.bpm$;

  private taps: number[] = [];

  constructor(
    private configService: ConfigService,
    private wsService: WSService
  ) {}

  ngOnInit(): void {
    // this.tap$.pipe(takeUntil(this.destroy$$), ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  onClickStart() {}

  onClickTap() {
    const now = Date.now();
    const length = this.taps.length;

    if (length === 0) {
      console.log('empty');
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
