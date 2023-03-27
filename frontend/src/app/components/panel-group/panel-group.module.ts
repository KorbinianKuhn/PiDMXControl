import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PanelGroupComponent } from './panel-group.component';

@NgModule({
  declarations: [PanelGroupComponent],
  imports: [CommonModule],
  exports: [PanelGroupComponent],
})
export class PanelGroupModule {}
