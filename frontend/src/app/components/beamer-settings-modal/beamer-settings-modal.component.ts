import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-beamer-settings-modal',
  templateUrl: './beamer-settings-modal.component.html',
  styleUrls: ['./beamer-settings-modal.component.scss'],
})
export class BeamerSettingsModalComponent {
  public visuals$ = this.wsService.visuals$;

  constructor(
    private wsService: WSService,
    private matDialogRef: MatDialogRef<BeamerSettingsModalComponent>
  ) {}

  onVisualChange(index: number) {
    this.wsService.setVisualSource(index);

    this.matDialogRef.close();
  }
}
