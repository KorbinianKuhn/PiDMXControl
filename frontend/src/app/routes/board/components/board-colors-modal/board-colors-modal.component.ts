import { Component } from '@angular/core';
import { ChaseColor } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

export const COLORS_FROM: { [key: string]: string } = {
  red: 'from-red-500',
  green: 'from-green-500',
  blue: 'from-blue-500',
  cyan: 'from-cyan-500',
  teal: 'from-teal-500',
  pink: 'from-pink-500',
  uv: 'from-purple-500',
  amber: 'from-yellow-500',
  white: 'from-white',
};

export const COLORS_TO: { [key: string]: string } = {
  red: 'to-red-500',
  green: 'to-green-500',
  blue: 'to-blue-500',
  cyan: 'to-cyan-500',
  teal: 'to-teal-500',
  pink: 'to-pink-500',
  uv: 'to-purple-500',
  amber: 'to-yellow-500',
  white: 'to-white',
};

@Component({
  selector: 'app-board-colors-modal',
  templateUrl: './board-colors-modal.component.html',
  styleUrls: ['./board-colors-modal.component.scss'],
})
export class BoardColorsModalComponent {
  public chaseColorEnum = ChaseColor;
  public colors$ = this.wsService.activeColors$;
  public current$ = this.wsService.currentActiveProgram$;

  public buttons: Array<{
    color: ChaseColor;
    gradient: string;
    a: string;
    b: string;
  }> = Object.values(ChaseColor).map((color) => {
    const [a, b] = color.split('-');

    return {
      color,
      gradient: `bg-gradient-to-br ${COLORS_FROM[a]} from-30% ${COLORS_TO[b]} to-70%`,
      a,
      b,
    };
  });

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
