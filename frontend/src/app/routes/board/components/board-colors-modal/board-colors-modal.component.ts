import { Component, computed, inject } from '@angular/core';
import { PadButtonComponent } from '../../../../components/pad-button/pad-button.component';
import { PanelGroupComponent } from '../../../../components/panel-group/panel-group.component';
import { ToggleButtonComponent } from '../../../../components/toggle-button/toggle-button.component';
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

export const COLORS_FROM_LIGHTER: { [key: string]: string } = {
  red: 'from-red-400',
  orange: 'from-orange-400',
  amber: 'from-amber-400',
  yellow: 'from-yellow-400',
  lime: 'from-lime-400',
  green: 'from-green-400',
  emerald: 'from-emerald-400',
  teal: 'from-teal-400',
  cyan: 'from-cyan-400',
  sky: 'from-sky-400',
  blue: 'from-blue-400',
  indigo: 'from-indigo-400',
  violet: 'from-violet-400',
  purple: 'from-purple-400',
  fuchsia: 'from-fuchsia-400',
  pink: 'from-pink-400',
};

export const COLORS_TO_DARKER: { [key: string]: string } = {
  red: 'to-red-600',
  orange: 'to-orange-600',
  amber: 'to-amber-600',
  yellow: 'to-yellow-600',
  lime: 'to-lime-600',
  green: 'to-green-600',
  emerald: 'to-emerald-600',
  teal: 'to-teal-600',
  cyan: 'to-cyan-600',
  sky: 'to-sky-600',
  blue: 'to-blue-600',
  indigo: 'to-indigo-600',
  violet: 'to-violet-600',
  purple: 'to-purple-600',
  fuchsia: 'to-fuchsia-600',
  pink: 'to-pink-600',
};

@Component({
  selector: 'app-board-colors-modal',
  templateUrl: './board-colors-modal.component.html',
  styleUrls: ['./board-colors-modal.component.scss'],
  imports: [PadButtonComponent, PanelGroupComponent, ToggleButtonComponent],
})
export class BoardColorsModalComponent {
  private wsService = inject(WSService);

  private readonly allColors = Object.values(ChaseColor);
  private readonly activeColors = this.wsService.activeColors;
  private readonly singleColors = [
    ...new Set(
      Object.values(ChaseColor)
        .map((color) => color.split('-'))
        .flat(),
    ),
  ];

  protected readonly current = this.wsService.currentActiveProgram;

  protected readonly colorButtons = computed(() => {
    return this.allColors.map((color) => {
      const [a, b] = color.split('-');

      return {
        color,
        gradient: `bg-gradient-to-br ${COLORS_FROM[a]} from-30% ${COLORS_TO[b]} to-70%`,
        a,
        b,
        active: this.activeColors().includes(color),
        current: this.current().color === color,
      };
    });
  });

  protected allOn = computed(
    () => this.activeColors().length === this.allColors.length,
  );
  protected allOff = computed(() => this.activeColors().length === 0);

  private isFilterActive(color: string) {
    return this.activeColors().some((o) => o.includes(color));
  }

  protected readonly filterButtons = computed(() => {
    return this.singleColors.map((color) => ({
      color,
      gradient: `bg-gradient-to-br from-${color}-400 from-30% to-${color}-600 to-70%`,
      active: this.isFilterActive(color),
    }));
  });

  onClickToggleColor(event: MouseEvent, color: ChaseColor) {
    event.stopImmediatePropagation();
    const colors = this.activeColors()!;
    const index = colors.indexOf(color);
    if (index === -1) {
      colors.push(color);
    } else {
      colors.splice(index, 1);
    }
    this.wsService.setColors(colors);
  }

  onClickToggleFilter(event: MouseEvent, color: string) {
    event.stopImmediatePropagation();
    const active = this.isFilterActive(color);
    const affectedColors = this.allColors.filter((o) => o.includes(color));
    if (active) {
      const activeColors = this.activeColors().filter(
        (o) => !affectedColors.includes(o),
      );
      this.wsService.setColors(activeColors);
    } else {
      const activeColors = this.allColors.filter(
        (o) => affectedColors.includes(o) || this.activeColors().includes(o),
      );
      this.wsService.setColors(activeColors);
    }
  }

  onClickSwitch(event: MouseEvent, on: boolean) {
    event.stopImmediatePropagation();
    this.wsService.setColors(on ? this.allColors : []);
  }
}
