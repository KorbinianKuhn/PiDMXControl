import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeviceConfigModalModule } from '../../device-config-modal/device-config-modal.module';
import { EuroliteLedPixBarComponent } from './eurolite-led-pix-bar.component';

@NgModule({
  declarations: [EuroliteLedPixBarComponent],
  imports: [CommonModule, DeviceConfigModalModule],
  exports: [EuroliteLedPixBarComponent],
})
export class EuroliteLedPixBarModule {}
