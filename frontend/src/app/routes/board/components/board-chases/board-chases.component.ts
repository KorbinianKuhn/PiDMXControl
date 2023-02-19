import { Component } from '@angular/core';
import { ChaseName } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-board-chases',
  templateUrl: './board-chases.component.html',
  styleUrls: ['./board-chases.component.scss'],
})
export class BoardChasesComponent {
  public chaseNameEnum = ChaseName;

  public chaseName$ = this.wsService.chaseName$;

  constructor(private wsService: WSService) {}

  isChaseActive(chaseName: ChaseName) {
    return this.chaseName$.getValue() === chaseName;
  }

  onClickChase(name: ChaseName) {
    this.wsService.setChaseName(name);
  }
}
