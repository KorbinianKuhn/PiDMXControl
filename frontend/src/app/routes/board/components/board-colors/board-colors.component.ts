import { Component } from '@angular/core';
import { ChaseColor } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-board-colors',
  templateUrl: './board-colors.component.html',
  styleUrls: ['./board-colors.component.scss'],
})
export class BoardColorsComponent {
  public chaseColorEnum = ChaseColor;
  public colors$ = this.wsService.activeColors$;

  constructor(private wsService: WSService) {}

  isColorActive(color: ChaseColor) {
    return this.colors$.getValue().includes(color);
  }

  onClickToggleColor(color: ChaseColor) {
    const colors = this.colors$.getValue();
    const index = colors.indexOf(color);
    if (index === -1) {
      colors.push(color);
    } else {
      colors.splice(index, 1);
    }
    this.wsService.setColors(colors);
  }
}
