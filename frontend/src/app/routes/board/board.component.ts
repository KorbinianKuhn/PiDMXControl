import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ActiveProgramButtonComponent } from '../../components/active-program-button/active-program-button.component';
import { OverrideProgramButtonComponent } from '../../components/override-program-button/override-program-button.component';
import { PadButtonComponent } from '../../components/pad-button/pad-button.component';
import { PanelGroupComponent } from '../../components/panel-group/panel-group.component';
import { ToggleButtonComponent } from '../../components/toggle-button/toggle-button.component';
import { ConfigService } from '../../services/config.service';
import { MqttService } from '../../services/mqtt.service';
import {
  ActiveProgramName,
  OverrideProgramName,
} from '../../services/ws.interfaces';
import { WSService } from '../../services/ws.service';
import { BeamerSettingsModalComponent } from './components/beamer-settings-modal/beamer-settings-modal.component';
import {
  BoardColorsModalComponent,
  COLORS_FROM,
  COLORS_TO,
} from './components/board-colors-modal/board-colors-modal.component';
import { BpmComponent } from './components/bpm/bpm.component';
import { BrightnessModalComponent } from './components/brightness-modal/brightness-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { VisualisationComponent } from './components/visualisation/visualisation.component';

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
    MatIconButton,
    MatIcon,
  ],
})
export class BoardComponent implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  private configService = inject(ConfigService);
  private wsService = inject(WSService);
  private mqttService = inject(MqttService);

  protected readonly overridePrograms: Array<{
    name: OverrideProgramName;
    title: string;
  }> = [
    {
      name: OverrideProgramName.WHITE,
      title: 'White',
    },
    {
      name: OverrideProgramName.DAY,
      title: 'Day',
    },
    {
      name: OverrideProgramName.NIGHT,
      title: 'Night',
    },
    {
      name: OverrideProgramName.WARM,
      title: 'Warm',
    },
    {
      name: OverrideProgramName.FADE,
      title: 'Fade',
    },
    {
      name: OverrideProgramName.PRIDE,
      title: 'Pride',
    },
    {
      name: OverrideProgramName.DISCO,
      title: 'Disco',
    },
  ];

  protected readonly activePrograms: Array<{
    name: ActiveProgramName;
    title: string;
  }> = [
    {
      name: ActiveProgramName.MIRROR_BALL,
      title: 'Ball',
    },
    {
      name: ActiveProgramName.GLOW,
      title: 'Glow',
    },
    {
      name: ActiveProgramName.MAGIC,
      title: 'Magic',
    },
    {
      name: ActiveProgramName.MOODY,
      title: 'Moody',
    },
    {
      name: ActiveProgramName.BOUNCY,
      title: 'Bouncy',
    },
    {
      name: ActiveProgramName.CLUB,
      title: 'Club',
    },
    {
      name: ActiveProgramName.PULSE,
      title: 'Pulse',
    },
    {
      name: ActiveProgramName.LATE,
      title: 'Late',
    },
    {
      name: ActiveProgramName.DARK,
      title: 'Dark',
    },
    {
      name: ActiveProgramName.ROUGH,
      title: 'Rough',
    },
    {
      name: ActiveProgramName.WILD,
      title: 'Wild',
    },
    {
      name: ActiveProgramName.RAVE,
      title: 'Rave',
    },
  ];

  protected readonly buildupPrograms: Array<{
    name: OverrideProgramName;
    duration: number;
    title: string;
  }> = [
    {
      name: OverrideProgramName.BUILDUP_STREAK,
      title: 'Streak',
      duration: -1,
    },
    {
      name: OverrideProgramName.BUILDUP_BLINK,
      title: 'Blink',
      duration: -1,
    },
    {
      name: OverrideProgramName.BUILDUP_BEAM,
      title: 'Beam',
      duration: -1,
    },
    {
      name: OverrideProgramName.BUILDUP_BLINDER,
      title: 'Blinder',
      duration: -1,
    },
    {
      name: OverrideProgramName.BUILDUP_BRIGHT,
      title: 'Bright',
      duration: 8,
    },
    {
      name: OverrideProgramName.BUILDUP_FADEOUT,
      title: 'Fadeout',
      duration: 8,
    },
  ];

  protected readonly strobePrograms: Array<{
    name: OverrideProgramName;
    title: string;
    duration: number;
  }> = [
    {
      name: OverrideProgramName.STROBE_FLAT,
      title: 'Wash',
      duration: -1,
    },
    {
      name: OverrideProgramName.STROBE_SLOWMO,
      title: 'Slow',
      duration: -1,
    },
    {
      name: OverrideProgramName.STROBE_COLOR,
      title: 'Color',
      duration: -1,
    },
    {
      name: OverrideProgramName.STROBE_WHITE,
      title: 'White',
      duration: -1,
    },
    {
      name: OverrideProgramName.STROBE_STORM,
      title: 'Storm',
      duration: -1,
    },
    {
      name: OverrideProgramName.STROBE_SHORT,
      title: 'Short',
      duration: 8,
    },
  ];

  protected readonly visualisation = this.configService.visualisation;
  protected readonly performanceMode = this.configService.performanceMode;
  protected readonly visuals = this.wsService.visuals;
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

  protected isVideoActive = computed(() => this.visuals().currentIndex > -1);

  ngOnInit(): void {
    this.mqttService.subscribe('visualisation/#');
  }

  ngOnDestroy(): void {
    this.mqttService.unsubscribe('visualisation/#');
  }

  onOpenSettingsModal() {
    this.dialog.open(SettingsModalComponent, {
      panelClass: 'custom-dialog',
      backdropClass: 'custom-backdrop',
      maxWidth: '90vw',
    });
  }

  onRefreshClick() {
    location.reload();
  }

  onOpenBrightnessModal() {
    this.dialog.open(BrightnessModalComponent, {
      panelClass: 'custom-dialog',
      backdropClass: 'custom-backdrop',
      maxWidth: '90vw',
    });
  }

  onClickOpenColorsModal() {
    this.dialog.open(BoardColorsModalComponent, {
      panelClass: 'custom-dialog',
      backdropClass: 'custom-backdrop',
      maxWidth: '90vw',
    });
  }

  onClickBlack() {
    const value = this.black();
    this.wsService.setBlack(!value);
  }

  onClickOpenVisualsModal() {
    this.dialog.open(BeamerSettingsModalComponent, {
      panelClass: 'custom-dialog',
      backdropClass: 'custom-backdrop',
      maxWidth: '90vw',
    });
  }

  onTogglePerformanceMode() {
    this.configService.togglePerformanceMode();
  }
}
