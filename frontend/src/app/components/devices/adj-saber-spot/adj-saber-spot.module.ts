import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeviceConfigModalModule } from '../../device-config-modal/device-config-modal.module';
import { AdjSaberSpotComponent } from './adj-saber-spot.component';

@NgModule({
  declarations: [AdjSaberSpotComponent],
  imports: [CommonModule, DeviceConfigModalModule],
  exports: [AdjSaberSpotComponent],
})
export class AdjSaberSpotModule {}
