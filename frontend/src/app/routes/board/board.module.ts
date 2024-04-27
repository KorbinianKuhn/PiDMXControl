import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BpmModule } from '../../components/bpm/bpm.module';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { LetModule } from '@ngrx/component';
import { ChannelMixerModalModule } from '../../components/channel-mixer-modal/channel-mixer-modal.module';
import { ChaseButtonComponent } from '../../components/chase-button/chase-button.component';
import { PadButtonModule } from '../../components/pad-button/pad-button.module';
import { PanelGroupModule } from '../../components/panel-group/panel-group.module';
import { ToggleButtonModule } from '../../components/toggle-button/toggle-button.module';
import { VisualizationModule } from '../../components/visualization/visualization.module';
import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { ActiveProgramButtonComponent } from './components/active-program-button/active-program-button.component';
import { BoardColorsModalComponent } from './components/board-colors-modal/board-colors-modal.component';
import { BrightnessModalModule } from './components/brightness-modal/brightness-modal.module';
import { OverrideProgramButtonComponent } from './components/override-program-button/override-program-button.component';
@NgModule({
  declarations: [
    BoardComponent,
    BoardColorsModalComponent,
    ChaseButtonComponent,
    ActiveProgramButtonComponent,
    OverrideProgramButtonComponent,
  ],
  imports: [
    CommonModule,
    BoardRoutingModule,
    PadButtonModule,
    ToggleButtonModule,
    BpmModule,
    VisualizationModule,
    PanelGroupModule,
    MatSliderModule,
    FormsModule,
    MatDialogModule,
    LetModule,
    ChannelMixerModalModule,
    MatIconModule,
    BrightnessModalModule,
    MatButtonModule,
  ],
})
export class BoardModule {}
