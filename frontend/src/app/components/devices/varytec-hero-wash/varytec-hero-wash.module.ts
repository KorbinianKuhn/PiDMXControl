import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeviceConfigModalModule } from '../../device-config-modal/device-config-modal.module';
import { VarytecHeroWashComponent } from './varytec-hero-wash.component';

@NgModule({
  declarations: [VarytecHeroWashComponent],
  imports: [CommonModule, DeviceConfigModalModule],
  exports: [VarytecHeroWashComponent],
})
export class VarytecHeroWashModule {}
