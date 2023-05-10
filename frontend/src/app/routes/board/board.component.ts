import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelMixerModalComponent } from '../../components/channel-mixer-modal/channel-mixer-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onOpenSettingsModal() {
    this.dialog.open(SettingsModalComponent, {
      width: '90vw',
    });
  }

  onOpenChannelMixerModal() {
    this.dialog.open(ChannelMixerModalComponent, {
      width: '90vw',
      height: '90vh',
    });
  }
}
