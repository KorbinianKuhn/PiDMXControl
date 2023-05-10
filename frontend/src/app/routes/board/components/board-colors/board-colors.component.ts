import { Component } from '@angular/core';
import { ChaseColor } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

const COLORS: { [key: string]: string } = {
  uv: 'purple-500',
  amber: 'yellow-500',
  white: 'white',
};
@Component({
  selector: 'app-board-colors',
  templateUrl: './board-colors.component.html',
  styleUrls: ['./board-colors.component.scss'],
})
export class BoardColorsComponent {
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
    const colorA = COLORS[a] ?? `${a}-500`;
    const colorB = COLORS[b] ?? `${b}-500`;

    return {
      color,
      gradient: `bg-gradient-to-br from-${colorA} from-30% to-${colorB} to-70%`,
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
