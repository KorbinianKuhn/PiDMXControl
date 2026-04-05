import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DEVICES } from '../../constants/devices.constants';
import { Device } from '../../interfaces/general.interfaces';
import { DeviceTesterComponent } from '../device-tester/device-tester.component';

@Component({
  selector: 'app-channel-mixer-modal',
  templateUrl: './channel-mixer-modal.component.html',
  styleUrls: ['./channel-mixer-modal.component.scss'],
  imports: [DeviceTesterComponent, MatTabsModule],
})
export class ChannelMixerModalComponent {
  public devices: Device[] = DEVICES;
}
