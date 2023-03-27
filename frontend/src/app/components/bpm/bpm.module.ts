import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { PadButtonModule } from '../pad-button/pad-button.module';
import { BpmModalComponent } from './bpm-modal/bpm-modal.component';
import { BpmComponent } from './bpm.component';

@NgModule({
  declarations: [BpmComponent, BpmModalComponent],
  imports: [CommonModule, PadButtonModule, MatDialogModule],
  exports: [BpmComponent],
})
export class BpmModule {}
