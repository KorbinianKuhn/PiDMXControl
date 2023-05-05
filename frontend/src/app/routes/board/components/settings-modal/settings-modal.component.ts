import { Component } from '@angular/core';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent {
  public master$ = this.wsService.master$;
  public ambientUV$ = this.wsService.ambientUV$;

  constructor(private wsService: WSService) {}

  onMasterChange(value: any) {
    this.wsService.setMaster(value);
  }

  onAmbientUVChange(value: any) {
    this.wsService.setAmbientUV(value);
  }
}
