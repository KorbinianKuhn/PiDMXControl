import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { WSService } from './services/ws.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public board: boolean = true;

  constructor(private wsService: WSService, private router: Router) {
    this.wsService.connect();
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
