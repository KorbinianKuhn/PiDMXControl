import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { DeviceTesterComponent } from './device-tester.component';

@NgModule({
  declarations: [DeviceTesterComponent],
  imports: [CommonModule, MatSliderModule],
  exports: [DeviceTesterComponent],
})
export class DeviceTesterModule {}
