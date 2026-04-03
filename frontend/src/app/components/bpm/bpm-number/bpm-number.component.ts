import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-bpm-number',
  templateUrl: './bpm-number.component.html',
  styleUrls: ['./bpm-number.component.scss'],
  imports: [NgClass],
})
export class BpmNumberComponent {
  private wsService = inject(WSService);
  private configService = inject(ConfigService);

  public bpm = toSignal(this.wsService.bpm$);

  public bars = toSignal(
    combineLatest([
      this.configService.performanceMode$,
      this.wsService.tick$,
    ]).pipe(
      map(([performanceMode, tick]) => {
        const values = [false, false, false, false];

        if (!performanceMode) {
          values[Math.floor(tick / 4)] = true;
        }

        return values;
      }),
    ),
  );
}
