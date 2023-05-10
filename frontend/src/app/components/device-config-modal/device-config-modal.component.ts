import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceConfig } from '../../services/ws.interfaces';
import { WSService } from '../../services/ws.service';

interface Control {
  key: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

@Component({
  selector: 'app-device-config-modal',
  templateUrl: './device-config-modal.component.html',
  styleUrls: ['./device-config-modal.component.scss'],
})
export class DeviceConfigModalComponent {
  public controls: Control[] = [];
  public device!: DeviceConfig;

  constructor(
    private wsService: WSService,
    @Inject(MAT_DIALOG_DATA) data: { id: string }
  ) {
    this.device = this.wsService.devices$
      .getValue()
      .find((o) => o.id === data.id) as DeviceConfig;

    if (this.device) {
      this.controls = Object.keys(this.device)
        .filter((key) => key !== 'id')
        .map((key) => {
          const value = (this.device as any)[key];
          switch (key) {
            case 'master': {
              return {
                key,
                value,
                min: 0,
                max: 1,
                step: 0.05,
              };
            }
            default: {
              return {
                key,
                value,
                min: 0,
                max: 1,
                step: 0.05,
              };
            }
          }
        });
    }
  }

  onValueChange(control: Control, event: any) {
    control.value = event;

    if (control.key === 'master') {
      const deviceGroup = this.device.id.split('-')[0];
      const allDevices = this.wsService.devices$
        .getValue()
        .filter((o) => o.id.startsWith(deviceGroup));

      for (const device of allDevices) {
        this.wsService.setDeviceConfig(device.id, {
          ...device,
          master: control.value,
        });
      }
    }
  }
}
