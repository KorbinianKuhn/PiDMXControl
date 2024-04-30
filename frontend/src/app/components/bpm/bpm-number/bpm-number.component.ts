import { Component } from '@angular/core';
import { map } from 'rxjs';
import { WSService } from '../../../services/ws.service';
import { NgClass, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-bpm-number',
    templateUrl: './bpm-number.component.html',
    styleUrls: ['./bpm-number.component.scss'],
    standalone: true,
    imports: [
    NgClass,
    AsyncPipe
],
})
export class BpmNumberComponent {
  public bpm$ = this.wsService.bpm$;
  public bars$ = this.wsService.tick$.pipe(
    map((value) => {
      const values = [false, false, false, false];
      values[Math.floor(value / 4)] = true;
      return values;
    })
  );

  constructor(private wsService: WSService) {}
}
