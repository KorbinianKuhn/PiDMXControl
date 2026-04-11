import { Component, inject } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { WSService } from '../../../../services/ws.service';
import { TestChannelDeviceComponent } from './test-channel-device/test-channel-device.component';

@Component({
  selector: 'app-test-channel-modal',
  templateUrl: './test-channel-modal.component.html',
  styleUrls: ['./test-channel-modal.component.scss'],
  imports: [TestChannelDeviceComponent, MatTabGroup, MatTab],
})
export class TestChannelModalComponent {
  private readonly wsService = inject(WSService);

  protected devices = this.wsService.devices;
}
