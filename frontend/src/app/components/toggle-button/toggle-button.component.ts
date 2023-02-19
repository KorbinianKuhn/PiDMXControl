import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent implements OnInit {
  @Input() colorOff: string = 'bg-gray-900';
  @Input() colorOn: string = 'bg-cyan-700';
  @Input() active: boolean | null = false;

  constructor() {}

  ngOnInit(): void {}
}
