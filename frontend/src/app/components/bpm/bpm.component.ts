import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WSService } from '../../services/ws.service';
import { BpmModalComponent } from './bpm-modal/bpm-modal.component';

@Component({
  selector: 'app-bpm',
  templateUrl: './bpm.component.html',
  styleUrls: ['./bpm.component.scss'],
})
export class BpmComponent implements OnInit {
  constructor(private matDialog: MatDialog, private wsService: WSService) {}

  ngOnInit(): void {}

  onClick() {
    this.matDialog.open(BpmModalComponent);
  }

  onClickStart() {
    this.wsService.setStart();
  }
}
