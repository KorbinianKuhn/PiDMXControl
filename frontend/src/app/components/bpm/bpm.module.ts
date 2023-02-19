import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PadButtonModule } from '../pad-button/pad-button.module';
import { BpmComponent } from './bpm.component';

@NgModule({
  declarations: [BpmComponent],
  imports: [CommonModule, PadButtonModule],
  exports: [BpmComponent],
})
export class BpmModule {}
