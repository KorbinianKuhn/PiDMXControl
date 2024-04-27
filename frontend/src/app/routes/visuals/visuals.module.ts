import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LetModule } from '@ngrx/component';
import { VisualsRoutingModule } from './visuals-routing.module';
import { VisualsComponent } from './visuals.component';

@NgModule({
  declarations: [VisualsComponent],
  imports: [CommonModule, VisualsRoutingModule, LetModule],
})
export class VisualsModule {}
