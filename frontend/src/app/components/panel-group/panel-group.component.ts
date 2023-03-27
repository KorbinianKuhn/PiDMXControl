import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-panel-group',
  templateUrl: './panel-group.component.html',
  styleUrls: ['./panel-group.component.scss'],
})
export class PanelGroupComponent {
  @Input() label!: string;
}
