import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { DeviceConfigModalComponent } from './device-config-modal.component';

@NgModule({
  declarations: [DeviceConfigModalComponent],
  imports: [CommonModule, MatSliderModule, FormsModule],
  exports: [DeviceConfigModalComponent],
})
export class DeviceConfigModalModule {}
