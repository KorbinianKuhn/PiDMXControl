import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DeviceTesterModule } from '../device-tester/device-tester.module';
import { ChannelMixerModalComponent } from './channel-mixer-modal.component';

@NgModule({
  declarations: [ChannelMixerModalComponent],
  imports: [CommonModule, DeviceTesterModule, MatExpansionModule],
  exports: [ChannelMixerModalComponent],
})
export class ChannelMixerModalModule {}
