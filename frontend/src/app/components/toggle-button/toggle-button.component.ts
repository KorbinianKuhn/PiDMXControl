import { Component, Input, OnInit } from '@angular/core';
import { PadButtonComponent } from '../pad-button/pad-button.component';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
  standalone: true,
  imports: [PadButtonComponent],
})
export class ToggleButtonComponent implements OnInit {
  @Input() colorOff: string = 'bg-gray-900';
  @Input() colorOn: string = 'bg-cyan-500';
  @Input() active: boolean | null = false;
  @Input() current: boolean = false;
  @Input() progress: number = 0;
  @Input() size: 'small' | 'normal' = 'normal';

  constructor() {}

  ngOnInit(): void {}
}
