import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetModule } from '@ngrx/component';
import { BeamerSettingsModalModule } from '../../beamer-settings-modal/beamer-settings-modal.module';
import { BeamerComponent } from './beamer.component';

@NgModule({
  declarations: [BeamerComponent],
  imports: [CommonModule, LetModule, BeamerSettingsModalModule],
  exports: [BeamerComponent],
})
export class BeamerModule {}
