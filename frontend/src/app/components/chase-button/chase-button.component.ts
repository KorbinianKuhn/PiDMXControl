import { Component, Input } from '@angular/core';
import { map } from 'rxjs';
import { ActiveProgramName } from '../../services/ws.interfaces';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-chase-button',
  templateUrl: './chase-button.component.html',
  styleUrls: ['./chase-button.component.scss'],
})
export class ChaseButtonComponent {
  @Input() name!: ActiveProgramName;

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
