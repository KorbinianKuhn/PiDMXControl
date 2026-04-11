import { Component, inject } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { WSService } from '../../../../services/ws.service';
import { TestChannelDeviceComponent } from './test-channel-device/test-channel-device.component';

@Component({
  selector: 'app-test-channel-device-list',
  templateUrl: './test-channel-device-list.component.html',
  styleUrls: ['./test-channel-device-list.component.scss'],
  imports: [TestChannelDeviceComponent, MatTabGroup, MatTab, MatTabContent],
})
export class TestChannelDeviceListComponent {
  private readonly wsService = inject(WSService);

  protected devices = this.wsService.devices;
}
