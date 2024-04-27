import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NeopixelStripComponent } from './neopixel-strip.component';

@NgModule({
  declarations: [NeopixelStripComponent],
  imports: [CommonModule],
  exports: [NeopixelStripComponent],
})
export class NeopixelStripModule {}
