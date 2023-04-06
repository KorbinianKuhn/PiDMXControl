import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BpmModalComponent } from './bpm-modal/bpm-modal.component';

@Component({
  selector: 'app-bpm',
  templateUrl: './bpm.component.html',
  styleUrls: ['./bpm.component.scss'],
})
export class BpmComponent implements OnInit {
  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  onClick() {
    this.matDialog.open(BpmModalComponent);
  }
}
