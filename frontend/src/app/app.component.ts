import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { map, throttleTime } from 'rxjs';
import { MqttService } from './services/mqtt.service';
import { WSService } from './services/ws.service';

const ICONS = [
  'settings',
  'tune',
  'refresh',
  'brightness',
  'visibility',
  'visibility_off',
  'movie',
  'movie_off',
  'neopixel_off',
  'tortoise',
  'close',
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, MatIcon, MatProgressBar],
})
export class AppComponent {
  private wsService = inject(WSService);
  private mqttService = inject(MqttService);
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  protected readonly status = this.wsService.status;
  protected readonly connected = this.wsService.connected;
  protected readonly progress = toSignal(
    toObservable(this.status).pipe(
      throttleTime(100),
      map((o) => o.progress ?? 0),
    ),
  );

  protected readonly showOverlay = computed(() => {
    if (location.href.includes('/visuals')) {
      return false;
    }

    return this.connected() === false || this.status().value !== 'ready';
  });

  constructor() {
    ICONS.map((o) =>
      this.matIconRegistry.addSvgIcon(
        o,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`svg/${o}.svg`),
      ),
    );

    this.wsService.connect();
    this.mqttService.connect();
  }

  onRefreshClick() {
    location.reload();
  }
}
