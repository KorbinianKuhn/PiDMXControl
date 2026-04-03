import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BeamerSettingsModalComponent } from '../../components/beamer-settings-modal/beamer-settings-modal.component';
import { BpmComponent } from '../../components/bpm/bpm.component';
import { ChannelMixerModalComponent } from '../../components/channel-mixer-modal/channel-mixer-modal.component';
import { PadButtonComponent } from '../../components/pad-button/pad-button.component';
import { PanelGroupComponent } from '../../components/panel-group/panel-group.component';
import { ToggleButtonComponent } from '../../components/toggle-button/toggle-button.component';
import { VisualisationComponent } from '../../components/visualisation/visualisation.component';
import { ConfigService } from '../../services/config.service';
import {
  ActiveProgramName,
  OverrideProgramName,
} from '../../services/ws.interfaces';
import { WSService } from '../../services/ws.service';
import { ActiveProgramButtonComponent } from './components/active-program-button/active-program-button.component';
import {
  BoardColorsModalComponent,
  COLORS_FROM,
  COLORS_TO,
} from './components/board-colors-modal/board-colors-modal.component';
import { BrightnessModalComponent } from './components/brightness-modal/brightness-modal.component';
import { OverrideProgramButtonComponent } from './components/override-program-button/override-program-button.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [
    PanelGroupComponent,
    ToggleButtonComponent,
    OverrideProgramButtonComponent,
    PadButtonComponent,
    ActiveProgramButtonComponent,
    BpmComponent,
    VisualisationComponent,
    MatButtonModule,
    MatIconModule,
    NgClass,
  ],
})
export class BoardComponent {
  private dialog = inject(MatDialog);
  private configService = inject(ConfigService);
  private wsService = inject(WSService);

  protected readonly activeProgram = ActiveProgramName;
  protected readonly overrideProgram = OverrideProgramName;

  protected readonly visualisation = this.configService.visualisation;
  protected readonly performanceMode = this.configService.performanceMode;
  protected readonly visualsSettings = this.wsService.visualsSettings;
  protected readonly black = this.wsService.black;

  protected readonly currentColor = computed(() => {
    const { color, progress } = this.wsService.currentActiveProgram();

    const [a, b] = color.split('-');
    return {
      color,
      gradient: `bg-gradient-to-br ${COLORS_FROM[a]} from-30% ${COLORS_TO[b]} to-70%`,
      a,
      b,
      progress,
    };
  });

  protected readonly neopixelDisabled = computed(
    () =>
      this.wsService.devices().find((d) => d.id === 'neopixel-a')?.disabled ||
      false,
  );

  onOpenChannelMixerModal() {
    this.dialog.open(ChannelMixerModalComponent, {
      width: '90vw',
      height: '90vh',
    });
  }

  onRefreshClick() {
    location.reload();
  }

  onOpenBrightnessModal() {
    this.dialog.open(BrightnessModalComponent, {
      width: '90vw',
    });
  }

  onClickOpenColorsModal() {
    this.dialog.open(BoardColorsModalComponent);
  }

  onClickBlack() {
    const value = this.black();
    this.wsService.setBlack(!value);
  }

  onClickOpenVisualsModal() {
    this.dialog.open(BeamerSettingsModalComponent);
  }

  onToggleNeopixelDisabled() {
    const config = this.wsService.devices().find((d) => d.id === 'neopixel-a')!;

    this.wsService.setDeviceConfig('neopixel-a', {
      ...config,
      disabled: !config.disabled,
    });
  }

  onTogglePerformanceMode() {
    this.configService.togglePerformanceMode();
  }
}
