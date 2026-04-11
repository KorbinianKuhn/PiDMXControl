import { Component, computed, inject, input } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { Device } from '../../../../../services/ws.interfaces';
import { WSService } from '../../../../../services/ws.service';

@Component({
  selector: 'app-test-channel-device',
  templateUrl: './test-channel-device.component.html',
  styleUrls: ['./test-channel-device.component.scss'],
  imports: [
    MatSliderModule, // TODO: remove module
  ],
})
export class TestChannelDeviceComponent {
  private wsService = inject(WSService);

  readonly device = input.required<Device>();

  protected readonly channels = computed(() => {
    const device = this.device();
    return device.id === 'bar'
      ? device.channels.slice(0, device.channels.length / 8)
      : device.channels;
  });

  protected readonly values = computed(() =>
    this.slice(this.wsService.testChannelData()),
  );

  private slice(buffer: number[]): number[] {
    return buffer.slice(
      this.device().address,
      this.device().address + this.device().channels.length,
    );
  }

  onValueChange(address: number, value: number) {
    const device = this.device();
    const addresses =
      device.id === 'bar'
        ? new Array(8).fill(null).map((_, i) => i * 6 + address)
        : [address];
    for (const a of addresses) {
      this.wsService.setTestChannelValue(a, value);
    }
  }
}
