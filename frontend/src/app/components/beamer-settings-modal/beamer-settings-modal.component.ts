import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { LetDirective } from '@ngrx/component';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-beamer-settings-modal',
  templateUrl: './beamer-settings-modal.component.html',
  styleUrls: ['./beamer-settings-modal.component.scss'],
  standalone: true,
  imports: [
    LetDirective,
    MatButtonModule,
    TitleCasePipe,
    MatRadioModule,
    FormsModule,
    MatSliderModule,
    MatCheckboxModule,
  ],
})
export class BeamerSettingsModalComponent {
  public visuals$ = this.wsService.visualsSettings$;

  constructor(private wsService: WSService) {}

  onVisualIndexChange(index: number) {
    this.wsService.setVisualsSource(index);
  }

  onSliderChange(
    direction: 'left' | 'right' | 'top' | 'bottom',
    event: { value: number }
  ) {
    const { currentIndex, ...settings } = this.visuals$.getValue();
    this.wsService.setVisualsSettings({
      ...settings,
      [direction]: event.value,
    });
  }

  onToggleColor() {
    const { currentIndex, ...settings } = this.visuals$.getValue();
    const color = settings.color === 'chase' ? 'original' : 'chase';
    this.wsService.setVisualsSettings({ ...settings, color });
  }

  onToggleOpacity() {
    const { currentIndex, ...settings } = this.visuals$.getValue();
    const opacity = settings.opacity === 'chase' ? 'off' : 'chase';
    this.wsService.setVisualsSettings({ ...settings, opacity });
  }

  onToggleText() {
    const { currentIndex, ...settings } = this.visuals$.getValue();
    this.wsService.setVisualsSettings({ ...settings, text: !settings.text });
  }
}
