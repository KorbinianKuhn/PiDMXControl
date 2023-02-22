import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
})
export class RangeSliderComponent {
  @Input() value: number = 0;
  @Input() label!: string;
  @Input() min: number = 0;
  @Input() max: number = 255;
  @Input() step: number = 1;

  @Output() valueChange = new EventEmitter<number>();

  onValueChange(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
