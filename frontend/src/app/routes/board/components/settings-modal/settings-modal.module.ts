import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { LetModule } from '@ngrx/component';
import { PanelGroupModule } from '../../../../components/panel-group/panel-group.module';
import { SettingsModalComponent } from './settings-modal.component';

@NgModule({
  declarations: [SettingsModalComponent],
  imports: [
    CommonModule,
    PanelGroupModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSelectModule,
    LetModule,
  ],
  exports: [SettingsModalComponent],
})
export class SettingsModalModule {}
