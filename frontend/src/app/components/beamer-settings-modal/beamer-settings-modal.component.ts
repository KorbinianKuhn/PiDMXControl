import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
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
  ],
})
export class BeamerSettingsModalComponent {
  public visuals$ = this.wsService.visuals$;

  constructor(private wsService: WSService) {}

  onVisualIndexChange(index: number) {
    const { color, opacity } = this.visuals$.getValue();
    this.wsService.setVisuals(index, color, opacity);
  }

  onVisualColorChange(color: 'chase' | 'original') {
    const { currentIndex, opacity } = this.visuals$.getValue();
    this.wsService.setVisuals(currentIndex, color, opacity);
  }

  onVisualOpacityChange(opacity: 'chase' | 'off') {
    const { currentIndex, color } = this.visuals$.getValue();
    this.wsService.setVisuals(currentIndex, color, opacity);
  }
}
