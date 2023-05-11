import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { LetModule } from '@ngrx/component';
import { BeamerSettingsModalComponent } from './beamer-settings-modal.component';

@NgModule({
  declarations: [BeamerSettingsModalComponent],
  imports: [CommonModule, LetModule, MatButtonModule, MatDialogModule],
  exports: [BeamerSettingsModalComponent],
})
export class BeamerSettingsModalModule {}
