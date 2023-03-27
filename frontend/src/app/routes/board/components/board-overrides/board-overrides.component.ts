import { Component } from '@angular/core';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-board-overrides',
  templateUrl: './board-overrides.component.html',
  styleUrls: ['./board-overrides.component.scss'],
})
export class BoardOverridesComponent {
  public black$ = this.wsService.black$;
  public master$ = this.wsService.master$;
  public ambientUV$ = this.wsService.ambientUV$;

  constructor(private wsService: WSService) {}

  onClickBlack() {
    const value = this.black$.getValue();
    this.wsService.setBlack(!value);
  }

  onMasterChange(event: any) {
    this.wsService.setMaster(event.target.value);
  }

  onAmbientUVChange(event: any) {
    this.wsService.setAmbientUV(event.target.value);
  }

  onClickStrobe() {}

  onClickDisco() {}
}
