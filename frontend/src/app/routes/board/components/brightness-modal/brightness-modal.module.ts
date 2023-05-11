import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { PanelGroupModule } from '../../../../components/panel-group/panel-group.module';
import { BrightnessModalComponent } from './brightness-modal.component';

@NgModule({
  declarations: [BrightnessModalComponent],
  imports: [CommonModule, MatSliderModule, PanelGroupModule],
  exports: [BrightnessModalComponent],
})
export class BrightnessModalModule {}
