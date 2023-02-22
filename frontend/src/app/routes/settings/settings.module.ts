import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from '../../components/accordion/accordion.module';

import { DeviceTesterModule } from '../../components/device-tester/device-tester.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    DeviceTesterModule,
    AccordionModule,
  ],
})
export class SettingsModule {}
