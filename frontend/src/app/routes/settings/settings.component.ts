import { Component } from '@angular/core';
import { DEVICES } from '../../constants/devices.constants';
import { Device } from '../../interfaces/general.interfaces';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  public devices: Device[] = DEVICES;

  public enabled = this.wsService.settingsMode$;

  constructor(private wsService: WSService) {}

  onToggle() {
    this.wsService.setSettingsMode(!this.enabled.getValue());
  }
}
