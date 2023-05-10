import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetModule } from '@ngrx/component';
import { DeviceConfigModalModule } from '../../device-config-modal/device-config-modal.module';
import { VideoModule } from '../../video/video.module';
import { BeamerComponent } from './beamer.component';

@NgModule({
  declarations: [BeamerComponent],
  imports: [CommonModule, VideoModule, LetModule, DeviceConfigModalModule],
  exports: [BeamerComponent],
})
export class BeamerModule {}
