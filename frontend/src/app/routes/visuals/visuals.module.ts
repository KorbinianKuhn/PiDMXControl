import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LetModule } from '@ngrx/component';
import { VideoModule } from '../../components/video/video.module';
import { VisualsRoutingModule } from './visuals-routing.module';
import { VisualsComponent } from './visuals.component';

@NgModule({
  declarations: [VisualsComponent],
  imports: [CommonModule, VisualsRoutingModule, VideoModule, LetModule],
})
export class VisualsModule {}
