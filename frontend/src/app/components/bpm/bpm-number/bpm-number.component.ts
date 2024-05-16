import { AsyncPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { combineLatest, map } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-bpm-number',
  templateUrl: './bpm-number.component.html',
  styleUrls: ['./bpm-number.component.scss'],
  standalone: true,
  imports: [NgClass, AsyncPipe, PushPipe],
})
export class BpmNumberComponent {
  public bpm$ = this.wsService.bpm$;

  public bars$ = combineLatest([
    this.configService.performanceMode$,
    this.wsService.tick$,
  ]).pipe(
    map(([performanceMode, tick]) => {
      const values = [false, false, false, false];

      if (!performanceMode) {
        values[Math.floor(tick / 4)] = true;
      }

      return values;
    })
  );

  constructor(
    private wsService: WSService,
    private configService: ConfigService
  ) {}
}
