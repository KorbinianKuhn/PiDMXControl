import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionItemComponent } from './accordion-item/accordion-item.component';
import { AccordionComponent } from './accordion.component';

@NgModule({
  declarations: [AccordionComponent, AccordionItemComponent],
  imports: [CommonModule],
  exports: [AccordionComponent, AccordionItemComponent],
})
export class AccordionModule {}
