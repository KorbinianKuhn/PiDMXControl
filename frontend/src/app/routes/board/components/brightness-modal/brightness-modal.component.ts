import { PercentPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { MatSliderDragEvent, MatSliderModule } from '@angular/material/slider';
import { PanelGroupComponent } from '../../../../components/panel-group/panel-group.component';
import { WSService } from '../../../../services/ws.service';

interface Control {
  id: string;
  value: number;
  disabled: boolean;
}

@Component({
  selector: 'app-brightness-modal',
  templateUrl: './brightness-modal.component.html',
  styleUrls: ['./brightness-modal.component.scss'],
  imports: [
    PanelGroupComponent,
    MatSliderModule, // TODO: remove module,
    PercentPipe,
    MatSlideToggle,
  ],
})
export class BrightnessModalComponent {
  private wsService = inject(WSService);

  public master = this.wsService.master;
  public ambientUV = this.wsService.ambientUV;
  public controls = computed(() => {
    const devices = this.wsService.deviceConfigs();

    const controls: Control[] = [];

    for (const device of devices) {
      const groupId = device.id.split('-')[0];

      if (!controls.some((o) => o.id === groupId)) {
        controls.push({
          id: groupId,
          value: device.master,
          disabled: device.disabled,
        });
      }
    }

    controls.sort((a, b) => a.id.localeCompare(b.id));

    return controls;
  });

  onMasterChange(value: any) {
    this.wsService.setMaster(value);
  }

  onAmbientUVChange(value: any) {
    this.wsService.setAmbientUV(value);
  }

  onSliderChange(control: Control, event: MatSliderDragEvent) {
    control.value = event.value;
    this.updateDeviceConfig(control);
  }

  onToggleChange(control: Control, event: MatSlideToggleChange) {
    control.disabled = event.checked;
    this.updateDeviceConfig(control);
  }

  private updateDeviceConfig(control: Control) {
    const allDevices = this.wsService
      .deviceConfigs()
      .filter((o) => o.id.startsWith(control.id));

    for (const device of allDevices) {
      this.wsService.setDeviceConfig(device.id, {
        ...device,
        master: control.value,
        disabled: control.disabled,
      });
    }
  }
}
