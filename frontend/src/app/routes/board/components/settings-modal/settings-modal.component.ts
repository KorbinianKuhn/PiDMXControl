import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { PadButtonComponent } from '../../../../components/pad-button/pad-button.component';
import { WSService } from '../../../../services/ws.service';
import { BeamerTextMessagesComponent } from './beamer-text-messages/beamer-text-messages.component';
import { DeviceConfigListComponent } from './device-config-list/device-config-list.component';
import { TestChannelDeviceListComponent } from './test-channel-device-list/test-channel-device-list.component';

@Component({
  selector: 'app-settings-modal',
  imports: [
    MatTabGroup,
    MatTab,
    MatTabContent,
    TestChannelDeviceListComponent,
    DeviceConfigListComponent,
    PadButtonComponent,
    BeamerTextMessagesComponent,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.scss',
})
export class SettingsModalComponent {
  private wsService = inject(WSService);
  private dialogRef = inject(MatDialogRef<SettingsModalComponent>);

  protected readonly testChannelMode = this.wsService.testChannelMode;

  onToggleTestChannelMode() {
    this.wsService.setTestChannelMode(!this.testChannelMode());
  }

  onClickRecreateChases() {
    this.wsService.setChasesRecreate();
    this.dialogRef.close();
  }

  onClickClose() {
    this.dialogRef.close();
  }
}
