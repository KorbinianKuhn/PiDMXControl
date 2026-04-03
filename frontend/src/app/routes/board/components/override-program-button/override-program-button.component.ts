import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ToggleButtonComponent } from '../../../../components/toggle-button/toggle-button.component';
import { OverrideProgramName } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-override-program-button',
  templateUrl: './override-program-button.component.html',
  styleUrls: ['./override-program-button.component.scss'],
  imports: [ToggleButtonComponent],
})
export class OverrideProgramButtonComponent {
  private wsService = inject(WSService);

  readonly name = input<OverrideProgramName>(); // TODO make required
  readonly size = input<'small' | 'normal'>('normal');
  readonly color = input<string>('bg-cyan-500');

  protected readonly current = toSignal(
    this.wsService.currentOverrideProgram$.pipe(
      map(({ programName, progress }) => {
        return {
          active: programName === this.name(),
          progress,
        };
      }),
    ),
  );

  onClick() {
    const name = this.name();
    const value =
      this.wsService.overrideProgramName$.getValue() === name ? null : name;
    this.wsService.setOverrideProgramName(value!);
  }
}
