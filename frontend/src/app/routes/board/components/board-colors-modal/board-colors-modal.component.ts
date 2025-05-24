import { Component } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { PadButtonComponent } from '../../../../components/pad-button/pad-button.component';
import { ChaseColor } from '../../../../services/ws.interfaces';
import { WSService } from '../../../../services/ws.service';

export const COLORS_FROM: { [key: string]: string } = {
  red: 'from-red-500',
  orange: 'from-orange-500',
  amber: 'from-amber-500',
  yellow: 'from-yellow-500',
  lime: 'from-lime-500',
  green: 'from-green-500',
  emerald: 'from-emerald-500',
  teal: 'from-teal-500',
  cyan: 'from-cyan-500',
  sky: 'from-sky-500',
  blue: 'from-blue-500',
  indigo: 'from-indigo-500',
  violet: 'from-violet-500',
  purple: 'from-purple-500',
  fuchsia: 'from-fuchsia-500',
  pink: 'from-pink-500',
};

export const COLORS_TO: { [key: string]: string } = {
  red: 'to-red-500',
  orange: 'to-orange-500',
  amber: 'to-amber-500',
  yellow: 'to-yellow-500',
  lime: 'to-lime-500',
  green: 'to-green-500',
  emerald: 'to-emerald-500',
  teal: 'to-teal-500',
  cyan: 'to-cyan-500',
  sky: 'to-sky-500',
  blue: 'to-blue-500',
  indigo: 'to-indigo-500',
  violet: 'to-violet-500',
  purple: 'to-purple-500',
  fuchsia: 'to-fuchsia-500',
  pink: 'to-pink-500',
};

@Component({
  selector: 'app-board-colors-modal',
  templateUrl: './board-colors-modal.component.html',
  styleUrls: ['./board-colors-modal.component.scss'],
  standalone: true,
  imports: [LetDirective, PadButtonComponent],
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
