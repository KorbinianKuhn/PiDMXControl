import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ConfigService } from '../../../../services/config.service';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent {
  public master$ = this.wsService.master$;
  public ambientUV$ = this.wsService.ambientUV$;
  public visualisation$ = this.configService.visualisation$;
  public visuals$ = this.wsService.visuals$;

  constructor(
    private wsService: WSService,
    private configService: ConfigService
  ) {}

  onMasterChange(value: any) {
    this.wsService.setMaster(value);
  }

  onAmbientUVChange(value: any) {
    this.wsService.setAmbientUV(value);
  }

  onToggleVisualisation() {
    this.configService.toggleVisualisation();
  }

  onVisualChange(event: MatSelectChange) {
    this.wsService.setVisualSource(event.value);
  }
}
