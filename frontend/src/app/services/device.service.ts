import { computed, inject, Injectable } from '@angular/core';
import { WSService } from './ws.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private readonly wsService = inject(WSService);

  readonly bar = computed(
    () => this.wsService.deviceConfigs().find((o) => o.id === 'bar')!,
  );
  readonly spot = computed(
    () => this.wsService.deviceConfigs().find((o) => o.id === 'spot')!,
  );
  readonly dome = computed(
    () => this.wsService.deviceConfigs().find((o) => o.id === 'dome')!,
  );
  readonly neopixel = computed(() =>
    this.wsService.deviceConfigs().filter((o) => o.id.startsWith('neopixel-')),
  );
  readonly hex = computed(() =>
    this.wsService.deviceConfigs().filter((o) => o.id.startsWith('hex-')),
  );
  readonly headLeft = computed(
    () => this.wsService.deviceConfigs().find((o) => o.id === 'head-left')!,
  );
  readonly headRight = computed(
    () => this.wsService.deviceConfigs().find((o) => o.id === 'head-right')!,
  );
  readonly beamer = computed(
    () => this.wsService.deviceConfigs().find((o) => o.id === 'beamer')!,
  );

  readonly isReady = computed(() => {
    if (
      this.bar() &&
      this.headLeft() &&
      this.headRight() &&
      this.hex().length === 5 &&
      this.beamer() &&
      this.dome() &&
      this.spot()
    ) {
      return true;
    }
    return false;
  });
}
