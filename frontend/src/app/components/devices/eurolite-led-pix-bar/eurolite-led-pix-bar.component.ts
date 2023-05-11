import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, map, takeUntil } from 'rxjs';
import { ColorService } from '../../../services/color.service';
import { ConfigService } from '../../../services/config.service';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-eurolite-led-pix-bar',
  templateUrl: './eurolite-led-pix-bar.component.html',
  styleUrls: ['./eurolite-led-pix-bar.component.scss'],
})
export class EuroliteLedPixBarComponent implements OnInit, OnDestroy {
  @Input() address!: number;
  @Input() id!: string;

  private destroy$$ = new Subject<void>();
  private numChannels = 8 * 6;

  public colors = new Array(8).fill('rgba(0,0,0,1)');
  public strobe = new Array(8).fill(null);
  public duration = new Array(8).fill(null);

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
      this.colors = new Array(8).fill('#000');
      this.strobe = new Array(8).fill(null);
      this.duration = new Array(8).fill(null);
      return;
    }

    for (let segment = 0; segment < 8; segment++) {
      const offset = segment * 6;
      const [master, strobe, r, g, b] = channels.slice(offset, offset + 6);

      this.colors[segment] = this.colorService.toRGB(master, r, g, b, 0, 0, 0);

      const { classes, duration } = this.colorService.getStrobeClasses(
        strobe,
        0,
        255
      );

      this.strobe[segment] = classes;
      this.duration[segment] = duration;
    }
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
