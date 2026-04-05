import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // public readonly visualisation = signal(!environment.production);
  public readonly visualisation = signal(false);
  public readonly video = signal(!environment.production);
  public readonly performanceMode = signal(false);

  togglePerformanceMode() {
    this.performanceMode.set(!this.performanceMode());
  }

  toggleVisualisation() {
    this.visualisation.set(!this.visualisation());
  }

  toggleVideo() {
    this.video.set(!this.video());
  }

  stopVideo() {
    this.video.set(false);
  }

  startVideo() {
    this.video.set(true);
  }
}
