import { Component } from '@angular/core';
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
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  public board: boolean = true;

  constructor(
    private wsService: WSService,
    private mqttService: MqttService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
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
