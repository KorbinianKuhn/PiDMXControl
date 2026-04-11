import { Component, computed, inject, input } from '@angular/core';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import {
  MatSlider,
  MatSliderDragEvent,
  MatSliderThumb,
} from '@angular/material/slider';
import { DeviceConfig } from '../../../../../../services/ws.interfaces';
import { WSService } from '../../../../../../services/ws.service';

type Control = SliderControl | ToggleControl;

interface SliderControl {
  type: 'slider';
  key: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

interface ToggleControl {
  type: 'toggle';
  key: string;
  value: boolean;
}

@Component({
  selector: 'app-device-config',
  imports: [MatSlider, MatSliderThumb, MatSlideToggle],
  templateUrl: './device-config.component.html',
  styleUrl: './device-config.component.scss',
})
export class DeviceConfigComponent {
  private wsService = inject(WSService);

  readonly device = input.required<DeviceConfig>();

  protected controls = computed<Control[]>(() =>
    Object.keys(this.device())
      .filter((key) => !['id', 'master', 'disabled'].includes(key))
      .map((key) => {
        const value = (this.device() as any)[key];

        if (value === true || value === false) {
          return {
            type: 'toggle',
            key,
            value,
          };
        }

        if (key === 'master') {
          return {
            type: 'slider',
            key,
            value: value as number,
            min: 0,
            max: 1,
            step: 0.05,
          };
        } else if (['left', 'right', 'top', 'bottom'].includes(key)) {
          return {
            type: 'slider',
            key,
            value: value as number,
            min: 0,
            max: 50,
            step: 1,
          };
        } else {
          return {
            type: 'slider',
            key,
            value: value as number,
            min: 0,
            max: 255,
            step: 5,
          };
        }
      }),
  );

  onSliderChange(control: SliderControl, event: MatSliderDragEvent) {
    const device = this.device();
    (device as any)[control.key] = event.value;
    this.wsService.setDeviceConfig(device.id, device);
  }

  onToggleChange(control: ToggleControl, event: MatSlideToggleChange) {
    const device = this.device();
    (device as any)[control.key] = event.checked;
    this.wsService.setDeviceConfig(device.id, device);
  }
}
