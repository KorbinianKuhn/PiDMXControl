import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { PanelGroupModule } from '../../../../components/panel-group/panel-group.module';
import { SettingsModalComponent } from './settings-modal.component';

@NgModule({
  declarations: [SettingsModalComponent],
  imports: [CommonModule, PanelGroupModule, MatSliderModule],
  exports: [SettingsModalComponent],
})
export class SettingsModalModule {}
