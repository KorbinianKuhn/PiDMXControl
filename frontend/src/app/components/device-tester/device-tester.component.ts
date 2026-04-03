import { Component, computed, inject, input } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { Device } from '../../interfaces/general.interfaces';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-device-tester',
  templateUrl: './device-tester.component.html',
  styleUrls: ['./device-tester.component.scss'],
  imports: [MatSliderModule],
})
export class DeviceTesterComponent {
  private wsService = inject(WSService);

  readonly device = input.required<Device>();

  protected readonly values = computed(() =>
    this.slice(this.wsService.settingsData()),
  );

  private slice(buffer: number[]): number[] {
    return buffer.slice(
      this.device().address,
      this.device().address + this.device().channels.length,
    );
  }

  onValueChange(address: number, value: number) {
    this.wsService.setSettingsChannel(address, value);
  }
}
