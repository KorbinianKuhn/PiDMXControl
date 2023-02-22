import { Component } from '@angular/core';
import { ActiveProgramName } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-board-chases',
  templateUrl: './board-chases.component.html',
  styleUrls: ['./board-chases.component.scss'],
})
export class BoardChasesComponent {
  public programs = ActiveProgramName;

  public activeProgramName$ = this.wsService.activeProgramName$;

  constructor(private wsService: WSService) {}

  isChaseActive(name: ActiveProgramName) {
    return this.activeProgramName$.getValue() === name;
  }

  onClickChase(name: ActiveProgramName) {
    this.wsService.setActiveProgramName(name);
  }
}
