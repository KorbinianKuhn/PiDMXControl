import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public visualisation$ = new BehaviorSubject<boolean>(true);

  constructor() {}

  toggleVisualisation() {
    this.visualisation$.next(!this.visualisation$.getValue());
  }
}
