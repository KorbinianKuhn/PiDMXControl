import { Component } from '@angular/core';
import { DEVICES } from '../../constants/devices.constants';
import { Device } from '../../interfaces/general.interfaces';
import { WSService } from '../../services/ws.service';
import { DeviceTesterComponent } from '../device-tester/device-tester.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgClass, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-channel-mixer-modal',
    templateUrl: './channel-mixer-modal.component.html',
    styleUrls: ['./channel-mixer-modal.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        MatExpansionModule,
        NgFor,
        DeviceTesterComponent,
        AsyncPipe,
    ],
})
export class ChannelMixerModalComponent {
  public devices: Device[] = DEVICES;

  public enabled = this.wsService.settingsMode$;

  constructor(private wsService: WSService) {}

  onToggle() {
    this.wsService.setSettingsMode(!this.enabled.getValue());
  }
}
