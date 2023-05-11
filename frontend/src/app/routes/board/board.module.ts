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
import { PadButtonModule } from '../../components/pad-button/pad-button.module';
import { PanelGroupModule } from '../../components/panel-group/panel-group.module';
import { ToggleButtonModule } from '../../components/toggle-button/toggle-button.module';
import { VisualizationModule } from '../../components/visualization/visualization.module';
import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { BoardBuildupsComponent } from './components/board-buildups/board-buildups.component';
import { BoardChasesComponent } from './components/board-chases/board-chases.component';
import { BoardColorsComponent } from './components/board-colors/board-colors.component';
import { BoardOverridesComponent } from './components/board-overrides/board-overrides.component';
import { BrightnessModalModule } from './components/brightness-modal/brightness-modal.module';
@NgModule({
  declarations: [
    BoardComponent,
    BoardColorsComponent,
    BoardChasesComponent,
    BoardOverridesComponent,
    BoardBuildupsComponent,
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
