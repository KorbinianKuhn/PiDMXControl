import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WSService } from '../../services/ws.service';
import { BpmModalComponent } from './bpm-modal/bpm-modal.component';
import { PadButtonComponent } from '../pad-button/pad-button.component';
import { BpmNumberComponent } from './bpm-number/bpm-number.component';

@Component({
    selector: 'app-bpm',
    templateUrl: './bpm.component.html',
    styleUrls: ['./bpm.component.scss'],
    imports: [BpmNumberComponent, PadButtonComponent]
})
export class BpmComponent implements OnInit {
  private matDialog = inject(MatDialog);
  private wsService = inject(WSService);


  ngOnInit(): void {}

  onClick() {
    this.matDialog.open(BpmModalComponent);
  }

  onClickStart() {
    this.wsService.setStart();
  }
}
