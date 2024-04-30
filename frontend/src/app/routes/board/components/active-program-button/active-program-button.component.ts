import { Component, Input } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { map } from 'rxjs';
import { PadButtonComponent } from '../../../../components/pad-button/pad-button.component';
import { ActiveProgramName } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-active-program-button',
  templateUrl: './active-program-button.component.html',
  styleUrls: ['./active-program-button.component.scss'],
  standalone: true,
  imports: [LetDirective, PadButtonComponent],
})
export class ActiveProgramButtonComponent {
  @Input() name!: ActiveProgramName;
  @Input() size: 'small' | 'normal' = 'normal';

  public current$ = this.wsService.currentActiveProgram$.pipe(
    map(({ programName, progress }) => {
      return {
        active: programName === this.name,
        progress,
      };
    })
  );

  constructor(private wsService: WSService) {}

  onClick() {
    this.wsService.setActiveProgramName(this.name);
  }
}
