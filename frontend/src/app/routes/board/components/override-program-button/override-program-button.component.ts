import { Component, computed, inject, input } from '@angular/core';
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

  protected readonly current = computed(() => {
    const { programName, progress } = this.wsService.currentOverrideProgram();
    return {
      active: programName === this.name(),
      progress,
    };
  });

  onClick() {
    const name = this.name();
    const value = this.wsService.overrideProgramName() === name ? null : name;
    this.wsService.setOverrideProgramName(value!);
  }
}
