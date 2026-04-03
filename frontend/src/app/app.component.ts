import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
    imports: [RouterOutlet]
})
export class AppComponent {
  private wsService = inject(WSService);
  private mqttService = inject(MqttService);
  private router = inject(Router);
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  public board: boolean = true;

  constructor() {
    const router = this.router;

    ICONS.map((o) =>
      this.matIconRegistry.addSvgIcon(
        o,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `assets/icons/${o}.svg`
        )
      )
    );

    this.wsService.connect();
    this.mqttService.connect();
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.board = event.url === '/board';
      });
  }

  onClickHeader() {
    if (this.board) {
      this.router.navigate(['/settings']);
    } else {
      this.router.navigate(['/board']);
    }
  }
}
