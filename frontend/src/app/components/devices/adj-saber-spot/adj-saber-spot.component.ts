import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, map, takeUntil } from 'rxjs';
import { ColorService } from '../../../services/color.service';
import { ConfigService } from '../../../services/config.service';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-adj-saber-spot',
  templateUrl: './adj-saber-spot.component.html',
  styleUrls: ['./adj-saber-spot.component.scss'],
})
export class AdjSaberSpotComponent implements OnInit {
  @Input() address!: number;
  @Input() id!: string;

  private destroy$$ = new Subject<void>();
  private numChannels = 6;

  public color: string = 'rgba(0,0,0,1)';
  public duration!: string;
  public strobe!: string;

  constructor(
    private wsService: WSService,
    private colorService: ColorService,
    private configService: ConfigService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.wsService.dmx$
      .pipe(
        takeUntil(this.destroy$$),
        map((data) => data.slice(this.address, this.address + this.numChannels))
      )
      .subscribe((channels) => this.updateColor(channels));
  }

  ngOnDestroy() {
    this.destroy$$.next();
  }

  updateColor(channels: number[]) {
    if (!this.configService.visualisation$.getValue()) {
      this.color = '#000';
      this.strobe = '';
      this.duration = '';
      return;
    }

    const [strobe, r, g, b, w, master] = channels;

    this.color = this.colorService.toRGB(master, r, g, b, w, 0, 0);

    const { classes, duration } = this.colorService.getStrobeClasses(
      strobe === 255 ? 0 : strobe, // 255 is always on
      64,
      95
    );

    this.strobe = classes;
    this.duration = duration;
  }

  // @HostListener('click')
  // onClick() {
  //   this.dialog.open(DeviceConfigModalComponent, {
  //     data: {
  //       id: this.id,
  //     },
  //   });
  // }
}
