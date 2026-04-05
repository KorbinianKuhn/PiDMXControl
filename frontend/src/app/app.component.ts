import { Component, inject } from '@angular/core';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
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
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, MatIcon],
})
export class AppComponent {
  private wsService = inject(WSService);
  private mqttService = inject(MqttService);
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  protected readonly wsConnected = this.wsService.connected;

  constructor() {
    ICONS.map((o) =>
      this.matIconRegistry.addSvgIcon(
        o,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `assets/icons/${o}.svg`,
        ),
      ),
    );

    this.wsService.connect();
    this.mqttService.connect();
  }

  onRefreshClick() {
    location.reload();
  }
}
