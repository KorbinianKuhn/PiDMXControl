import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, map, takeUntil, throttleTime } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ColorService } from '../../../services/color.service';
import { ConfigService } from '../../../services/config.service';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-varytec-hero-wash',
  templateUrl: './varytec-hero-wash.component.html',
  styleUrls: ['./varytec-hero-wash.component.scss'],
})
export class VarytecHeroWashComponent implements OnInit {
  @Input() address!: number;
  @Input() id!: string;

  private destroy$$ = new Subject<void>();
  private numChannels = 16;

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
        throttleTime(environment.visualisationThrottleTime),
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

    const [
      pan,
      panFine,
      tilt,
      tiltFine,
      speed,
      master,
      strobe,
      r,
      g,
      b,
      w,
      a,
      uv,
    ] = channels;

    this.color = this.colorService.toRGB(master, r, g, b, w, a, uv);

    const { classes, duration } = this.colorService.getStrobeClasses(
      strobe,
      0,
      255
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
