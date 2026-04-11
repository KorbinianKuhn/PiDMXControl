import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';
import {
  MatSlider,
  MatSliderDragEvent,
  MatSliderRangeThumb,
} from '@angular/material/slider';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-beamer-settings-modal',
  templateUrl: './beamer-settings-modal.component.html',
  styleUrls: ['./beamer-settings-modal.component.scss'],
  imports: [
    TitleCasePipe,
    MatRadioButton,
    MatSlider,
    MatSliderRangeThumb,
    MatCheckbox,
    MatRadioGroup,
  ],
})
export class BeamerSettingsModalComponent {
  private wsService = inject(WSService);

  protected readonly visuals = this.wsService.visualsSettings;

  onVisualIndexChange(event: MatRadioChange<number>) {
    this.wsService.setVisualsSource(event.value);
  }

  onSliderChange(
    direction: 'left' | 'right' | 'top' | 'bottom',
    event: MatSliderDragEvent,
  ) {
    const { currentIndex, ...settings } = this.visuals()!;
    this.wsService.setVisualsSettings({
      ...settings,
      [direction]: event.value,
    });
  }

  onToggleColor() {
    const { currentIndex, ...settings } = this.visuals()!;
    const color = settings.color === 'chase' ? 'original' : 'chase';
    this.wsService.setVisualsSettings({ ...settings, color });
  }

  onToggleOpacity() {
    const { currentIndex, ...settings } = this.visuals()!;
    const opacity = settings.opacity === 'chase' ? 'off' : 'chase';
    this.wsService.setVisualsSettings({ ...settings, opacity });
  }

  onToggleText() {
    const { currentIndex, ...settings } = this.visuals()!;
    this.wsService.setVisualsSettings({ ...settings, text: !settings.text });
  }
}
