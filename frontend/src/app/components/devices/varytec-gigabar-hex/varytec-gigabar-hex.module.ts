import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeviceConfigModalModule } from '../../device-config-modal/device-config-modal.module';
import { VarytecGigabarHexComponent } from './varytec-gigabar-hex.component';

@NgModule({
  declarations: [VarytecGigabarHexComponent],
  imports: [CommonModule, DialogModule, DeviceConfigModalModule],
  exports: [VarytecGigabarHexComponent],
})
export class VarytecGigabarHexModule {}
