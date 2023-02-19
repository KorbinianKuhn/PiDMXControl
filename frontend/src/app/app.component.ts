import { Component } from '@angular/core';
import { WSService } from './services/ws.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private wsService: WSService) {
    this.wsService.connect();
  }
}
