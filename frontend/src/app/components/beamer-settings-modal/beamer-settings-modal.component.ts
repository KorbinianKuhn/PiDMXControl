import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-beamer-settings-modal',
  templateUrl: './beamer-settings-modal.component.html',
  styleUrls: ['./beamer-settings-modal.component.scss'],
  imports: [
    MatButtonModule, // TODO: remove module
    TitleCasePipe,
    MatRadioModule, // TODO: remove module
    FormsModule, // TODO: remove module
    MatSliderModule, // TODO: remove module
    MatCheckboxModule, // TODO: remove module
  ],
})
export class BeamerSettingsModalComponent {
  private wsService = inject(WSService);

  protected readonly visuals = this.wsService.visualsSettings;

  onVisualIndexChange(index: number) {
    this.wsService.setVisualsSource(index);
  }

  onSliderChange(
    direction: 'left' | 'right' | 'top' | 'bottom',
    event: { value: number },
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
