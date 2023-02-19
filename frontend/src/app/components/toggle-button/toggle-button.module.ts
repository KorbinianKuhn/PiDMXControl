import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PadButtonModule } from '../pad-button/pad-button.module';
import { ToggleButtonComponent } from './toggle-button.component';

@NgModule({
  declarations: [ToggleButtonComponent],
  imports: [CommonModule, PadButtonModule],
  exports: [ToggleButtonComponent],
})
export class ToggleButtonModule {}
