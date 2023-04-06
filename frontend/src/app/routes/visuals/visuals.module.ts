import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisualsRoutingModule } from './visuals-routing.module';
import { VisualsComponent } from './visuals.component';


@NgModule({
  declarations: [
    VisualsComponent
  ],
  imports: [
    CommonModule,
    VisualsRoutingModule
  ]
})
export class VisualsModule { }
