import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { PadButtonComponent } from '../../../../components/pad-button/pad-button.component';
import { WSService } from '../../../../services/ws.service';
import { TestChannelModalComponent } from '../test-channel-modal/test-channel-modal.component';
import { DeviceConfigListComponent } from './device-config-list/device-config-list.component';

@Component({
  selector: 'app-settings-modal',
  imports: [
    MatTabGroup,
    MatTab,
    TestChannelModalComponent,
    DeviceConfigListComponent,
    PadButtonComponent,
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
}
