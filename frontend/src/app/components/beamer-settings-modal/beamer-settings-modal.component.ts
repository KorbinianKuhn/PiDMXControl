import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';
import { WSService } from '../../services/ws.service';
import { PanelGroupComponent } from '../panel-group/panel-group.component';

@Component({
  selector: 'app-beamer-settings-modal',
  templateUrl: './beamer-settings-modal.component.html',
  styleUrls: ['./beamer-settings-modal.component.scss'],
  imports: [
    TitleCasePipe,
    MatRadioButton,
    MatCheckbox,
    MatRadioGroup,
    PanelGroupComponent,
  ],
})
export class BeamerSettingsModalComponent {
  private wsService = inject(WSService);

  protected readonly visuals = this.wsService.visuals;

  onVisualIndexChange(event: MatRadioChange<number>) {
    this.wsService.setVisualsSource(event.value);
  }

  onToggleColor() {
    const visuals = this.visuals()!;
    const color = visuals.color === 'chase' ? 'original' : 'chase';
    this.wsService.setVisualsSettings({ color });
  }

  onToggleOpacity() {
    const visuals = this.visuals()!;
    const opacity = visuals.opacity === 'chase' ? 'off' : 'chase';
    this.wsService.setVisualsSettings({ opacity });
  }

  onToggleText() {
    const { showText } = this.visuals()!;
    this.wsService.setVisualsSettings({ showText: !showText });
  }
}
