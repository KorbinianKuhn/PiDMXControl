import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeviceConfigModalModule } from '../../device-config-modal/device-config-modal.module';
import { FunGenerationLedDiamondDomeComponent } from './fun-generation-led-diamond-dome.component';

@NgModule({
  declarations: [FunGenerationLedDiamondDomeComponent],
  imports: [CommonModule, DeviceConfigModalModule],
  exports: [FunGenerationLedDiamondDomeComponent],
})
export class FunGenerationLedDiamondDomeModule {}
