import { Component } from '@angular/core';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-board-overrides',
  templateUrl: './board-overrides.component.html',
  styleUrls: ['./board-overrides.component.scss'],
})
export class BoardOverridesComponent {
  public black$ = this.wsService.black$;
  public strobe$ = this.wsService.strobe$;
  public master$ = this.wsService.master$;

  constructor(private wsService: WSService) {}

  onClickBlack() {
    const value = this.black$.getValue();
    this.wsService.setBlack(!value);
  }

  onMasterChange(event: any) {
    this.wsService.setMaster(event.target.value);
  }

  onClickStrobe() {
    const value = this.strobe$.getValue();
    this.wsService.setStrobe(!value);
  }
}
