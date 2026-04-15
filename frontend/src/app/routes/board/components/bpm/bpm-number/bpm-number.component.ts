import { Component, computed, inject } from '@angular/core';
import { ConfigService } from '../../../../../services/config.service';
import { WSService } from '../../../../../services/ws.service';

@Component({
  selector: 'app-bpm-number',
  templateUrl: './bpm-number.component.html',
  styleUrls: ['./bpm-number.component.scss'],
  imports: [],
})
export class BpmNumberComponent {
  private wsService = inject(WSService);
  private configService = inject(ConfigService);

  protected readonly bpm = this.wsService.bpm;

  protected readonly bars = computed(() => {
    const values = [false, false, false, false];

    if (!this.configService.performanceMode()) {
      values[Math.floor(this.wsService.tick() / 4)] = true;
    }

    return values;
  });
}
