import { Component } from '@angular/core';
import { WSService } from '../../../../services/ws.service';
import { AsyncPipe } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { PanelGroupComponent } from '../../../../components/panel-group/panel-group.component';

interface Control {
  id: string;
  value: number;
}

@Component({
    selector: 'app-brightness-modal',
    templateUrl: './brightness-modal.component.html',
    styleUrls: ['./brightness-modal.component.scss'],
    standalone: true,
    imports: [
    PanelGroupComponent,
    MatSliderModule,
    AsyncPipe
],
})
export class BrightnessModalComponent {
  public master$ = this.wsService.master$;
  public ambientUV$ = this.wsService.ambientUV$;
  public controls: Control[] = [];

  constructor(private wsService: WSService) {
    this.wsService.devices$.getValue().map((device) => {
      const groupId = device.id.split('-')[0];

      if (!this.controls.some((o) => o.id === groupId)) {
        this.controls.push({
          id: groupId,
          value: device.master,
        });
      }
    });

    this.controls.sort((a, b) => a.id.localeCompare(b.id));
  }

  onMasterChange(value: any) {
    this.wsService.setMaster(value);
  }

  onAmbientUVChange(value: any) {
    this.wsService.setAmbientUV(value);
  }

  onValueChange(control: Control, event: any) {
    control.value = event;

    const allDevices = this.wsService.devices$
      .getValue()
      .filter((o) => o.id.startsWith(control.id));

    for (const device of allDevices) {
      this.wsService.setDeviceConfig(device.id, {
        ...device,
        master: control.value,
      });
    }
  }
}
