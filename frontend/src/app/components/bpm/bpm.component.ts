import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WSService } from '../../services/ws.service';
import { PadButtonComponent } from '../pad-button/pad-button.component';
import { BpmModalComponent } from './bpm-modal/bpm-modal.component';
import { BpmNumberComponent } from './bpm-number/bpm-number.component';

@Component({
  selector: 'app-bpm',
  templateUrl: './bpm.component.html',
  styleUrls: ['./bpm.component.scss'],
  imports: [BpmNumberComponent, PadButtonComponent],
})
export class BpmComponent {
  private matDialog = inject(MatDialog);
  private wsService = inject(WSService);

  onClick() {
    this.matDialog.open(BpmModalComponent, {
      panelClass: 'custom-dialog',
      backdropClass: 'custom-backdrop',
    });
  }

  onClickStart() {
    this.wsService.setStart();
  }
}
