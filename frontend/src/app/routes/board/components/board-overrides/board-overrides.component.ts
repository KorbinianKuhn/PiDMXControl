import { Component } from '@angular/core';
import { OverrideProgramName } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-board-overrides',
  templateUrl: './board-overrides.component.html',
  styleUrls: ['./board-overrides.component.scss'],
})
export class BoardOverridesComponent {
  public black$ = this.wsService.black$;
  public overrideProgramName$ = this.wsService.overrideProgramName$;
  public programs = OverrideProgramName;

  constructor(private wsService: WSService) {}

  isChaseActive(name: OverrideProgramName) {
    return this.overrideProgramName$.getValue() === name;
  }

  onClickBlack() {
    const value = this.black$.getValue();
    this.wsService.setBlack(!value);
  }

  onClickFade() {
    const value =
      this.overrideProgramName$.getValue() === OverrideProgramName.FADE
        ? null
        : OverrideProgramName.FADE;
    this.wsService.setOverrideProgramName(value);
  }

  onClickStrobe() {
    const value =
      this.overrideProgramName$.getValue() === OverrideProgramName.STROBE
        ? null
        : OverrideProgramName.STROBE;
    this.wsService.setOverrideProgramName(value);
  }

  onClickDisco() {
    const value =
      this.overrideProgramName$.getValue() === OverrideProgramName.DISCO
        ? null
        : OverrideProgramName.DISCO;
    this.wsService.setOverrideProgramName(value);
  }
}
