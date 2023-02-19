import { Injectable } from '@angular/core';
import { interval, map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  clock$ = interval((60 * 1000) / 128).pipe(map((o, i) => i % 4));
  bpm$ = new Subject<number>();

  constructor() {}
}
