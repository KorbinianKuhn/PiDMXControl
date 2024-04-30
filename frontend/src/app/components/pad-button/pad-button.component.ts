import { Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-pad-button',
    templateUrl: './pad-button.component.html',
    styleUrls: ['./pad-button.component.scss'],
    standalone: true,
    imports: [NgClass],
})
export class PadButtonComponent implements OnInit {
  @Input() color!: string;
  @Input() active: boolean = true;
  @Input() current: boolean | null = false;
  @Input() size: 'small' | 'normal' = 'normal';
  @Input() progress: number = 0;

  get opacity(): number {
    if (this.current) {
      return 20;
    }
    return this.active ? 10 : 70;
  }

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    // this.active = !this.active;
  }
}
