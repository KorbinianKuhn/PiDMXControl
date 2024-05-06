import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public visualisation$ = new BehaviorSubject<boolean>(!environment.production);
  public video$ = new BehaviorSubject<boolean>(!environment.production);

  constructor() {}

  toggleVisualisation() {
    this.visualisation$.next(!this.visualisation$.getValue());
  }

  toggleVideo() {
    this.video$.next(!this.video$.getValue());
  }

  stopVideo() {
    this.video$.next(false);
  }

  startVideo() {
    this.video$.next(true);
  }
}
