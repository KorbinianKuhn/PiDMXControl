import { Component, computed, inject, input } from '@angular/core';
import { PadButtonComponent } from '../../../../components/pad-button/pad-button.component';
import { ActiveProgramName } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-active-program-button',
  templateUrl: './active-program-button.component.html',
  styleUrls: ['./active-program-button.component.scss'],
  imports: [PadButtonComponent],
})
export class ActiveProgramButtonComponent {
  private wsService = inject(WSService);

  readonly name = input.required<ActiveProgramName>();
  readonly size = input<'small' | 'normal'>('normal');

  protected readonly current = computed(() => {
    const { programName, progress } = this.wsService.currentActiveProgram();
    return {
      active: programName === this.name(),
      progress,
    };
  });

  onClick() {
    this.wsService.setActiveProgramName(this.name()!);
  }
}
