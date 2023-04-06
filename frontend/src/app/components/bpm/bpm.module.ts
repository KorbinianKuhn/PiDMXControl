import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { PadButtonModule } from '../pad-button/pad-button.module';
import { BpmModalComponent } from './bpm-modal/bpm-modal.component';
import { BpmNumberComponent } from './bpm-number/bpm-number.component';
import { BpmComponent } from './bpm.component';

@NgModule({
  declarations: [BpmComponent, BpmModalComponent, BpmNumberComponent],
  imports: [
    CommonModule,
    PadButtonModule,
    MatDialogModule,
    MatSliderModule,
    FormsModule,
  ],
  exports: [BpmComponent],
})
export class BpmModule {}
