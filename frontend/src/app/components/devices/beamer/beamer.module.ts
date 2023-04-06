import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BeamerComponent } from './beamer.component';

@NgModule({
  declarations: [BeamerComponent],
  imports: [CommonModule],
  exports: [BeamerComponent],
})
export class BeamerModule {}
