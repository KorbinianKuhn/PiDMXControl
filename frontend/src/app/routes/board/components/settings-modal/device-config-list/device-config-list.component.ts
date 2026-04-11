import { Component, computed, inject } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { WSService } from '../../../../../services/ws.service';
import { DeviceConfigComponent } from './device-config/device-config.component';

@Component({
  selector: 'app-device-config-list',
  imports: [DeviceConfigComponent, MatTabGroup, MatTab, MatTabContent],
  templateUrl: './device-config-list.component.html',
  styleUrl: './device-config-list.component.scss',
})
export class DeviceConfigListComponent {
  private wsService = inject(WSService);

  protected deviceConfigs = this.wsService.deviceConfigs;

  protected configs = computed(() =>
    this.deviceConfigs().filter(
      (o) =>
        Object.keys(o).filter((k) => !['master', 'id', 'disabled'].includes(k))
          .length > 0,
    ),
  );

  onClickRecreate() {
    this.wsService.setChasesRecreate();
  }
}
