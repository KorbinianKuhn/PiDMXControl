import { Component } from '@angular/core';
import { OverrideProgramName } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-board-buildups',
  templateUrl: './board-buildups.component.html',
  styleUrls: ['./board-buildups.component.scss'],
})
export class BoardBuildupsComponent {
  public overrideProgramName$ = this.wsService.overrideProgramName$;
  public programs = OverrideProgramName;

  constructor(private wsService: WSService) {}

  isChaseActive(name: OverrideProgramName) {
    return this.overrideProgramName$.getValue() === name;
  }

  onClickChase(name: OverrideProgramName) {
    this.wsService.setOverrideProgramName(name);
  }
}
