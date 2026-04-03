import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
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

  readonly name = input<ActiveProgramName>(); // TODO make required
  readonly size = input<'small' | 'normal'>('normal');

  protected readonly current = toSignal(
    this.wsService.currentActiveProgram$.pipe(
      map(({ programName, progress }) => {
        return {
          active: programName === this.name(),
          progress,
        };
      }),
    ),
  );

  onClick() {
    this.wsService.setActiveProgramName(this.name()!);
  }
}
