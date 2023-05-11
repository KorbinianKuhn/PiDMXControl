import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelMixerModalComponent } from '../../components/channel-mixer-modal/channel-mixer-modal.component';
import { ConfigService } from '../../services/config.service';
import { BrightnessModalComponent } from './components/brightness-modal/brightness-modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public visualisation$ = this.configService.visualisation$;
  public video$ = this.configService.video$;

  constructor(
    private dialog: MatDialog,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {}

  onOpenChannelMixerModal() {
    this.dialog.open(ChannelMixerModalComponent, {
      width: '90vw',
      height: '90vh',
    });
  }

  onRefreshClick() {
    location.reload();
  }

  onOpenBrightnessModal() {
    this.dialog.open(BrightnessModalComponent, {
      width: '90vw',
    });
  }

  onVisualisationToggle() {
    this.configService.toggleVisualisation();
  }

  onVideoToggle() {
    this.configService.toggleVideo();
  }
}
