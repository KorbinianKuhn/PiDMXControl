import { Component, OnInit, input } from '@angular/core';
import { PadButtonComponent } from '../pad-button/pad-button.component';

@Component({
    selector: 'app-toggle-button',
    templateUrl: './toggle-button.component.html',
    styleUrls: ['./toggle-button.component.scss'],
    imports: [PadButtonComponent]
})
export class ToggleButtonComponent implements OnInit {
  readonly colorOff = input<string>('bg-gray-900');
  readonly colorOn = input<string>('bg-cyan-500');
  readonly active = input<boolean | null>(false);
  readonly current = input<boolean>(false);
  readonly progress = input<number>(0);
  readonly size = input<'small' | 'normal'>('normal');

  constructor() {}

  ngOnInit(): void {}
}
