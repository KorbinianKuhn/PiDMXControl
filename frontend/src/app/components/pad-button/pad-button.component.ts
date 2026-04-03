import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-pad-button',
  templateUrl: './pad-button.component.html',
  styleUrls: ['./pad-button.component.scss'],
  imports: [NgClass],
})
export class PadButtonComponent {
  private configService = inject(ConfigService);

  readonly color = input.required<string>();
  readonly active = input<boolean>(true);
  readonly current = input<boolean | null>(false);
  readonly size = input<'small' | 'normal'>('normal');
  readonly progress = input<number>(0);

  protected readonly performanceMode = toSignal(
    this.configService.performanceMode$,
    { initialValue: false },
  );

  get opacity(): number {
    if (this.current()) {
      return 20;
    }
    return this.active() ? 10 : 70;
  }
}
