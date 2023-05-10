import { Component } from '@angular/core';
import { DEVICES } from '../../constants/devices.constants';
import { Device } from '../../interfaces/general.interfaces';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-channel-mixer-modal',
  templateUrl: './channel-mixer-modal.component.html',
  styleUrls: ['./channel-mixer-modal.component.scss'],
})
export class ChannelMixerModalComponent {
  public devices: Device[] = DEVICES;

  public enabled = this.wsService.settingsMode$;

  constructor(private wsService: WSService) {}

  onToggle() {
    this.wsService.setSettingsMode(!this.enabled.getValue());
  }
}
