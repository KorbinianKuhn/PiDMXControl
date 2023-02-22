import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RangeSliderModule } from '../range-slider/range-slider.module';
import { DeviceTesterComponent } from './device-tester.component';

@NgModule({
  declarations: [DeviceTesterComponent],
  imports: [CommonModule, RangeSliderModule],
  exports: [DeviceTesterComponent],
})
export class DeviceTesterModule {}
