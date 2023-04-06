import { Component } from '@angular/core';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-board-overrides',
  templateUrl: './board-overrides.component.html',
  styleUrls: ['./board-overrides.component.scss'],
})
export class BoardOverridesComponent {
  public black$ = this.wsService.black$;

  constructor(private wsService: WSService) {}

  onClickBlack() {
    const value = this.black$.getValue();
    this.wsService.setBlack(!value);
  }

  onClickStrobe() {}

  onClickDisco() {}
}
