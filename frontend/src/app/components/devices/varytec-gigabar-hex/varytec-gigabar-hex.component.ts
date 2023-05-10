import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, map, takeUntil } from 'rxjs';
import { ColorService } from '../../../services/color.service';
import { ConfigService } from '../../../services/config.service';
import { WSService } from '../../../services/ws.service';
import { DeviceConfigModalComponent } from '../../device-config-modal/device-config-modal.component';

@Component({
  selector: 'app-varytec-gigabar-hex',
  templateUrl: './varytec-gigabar-hex.component.html',
  styleUrls: ['./varytec-gigabar-hex.component.scss'],
})
export class VarytecGigabarHexComponent implements OnInit, OnDestroy {
  @Input() vertical = false;
  @Input() address!: number;
  @Input() id!: string;

  private destroy$$ = new Subject<void>();
  private numChannels = 9;
  public lamps = new Array(3).fill(null);

  public color: string = 'rgba(0,0,0,1)';
  public duration!: string;
  public strobe!: string;

  constructor(
    private wsService: WSService,
    private colorService: ColorService,
    private dialog: MatDialog,
    private configService: ConfigService
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

    const [r, g, b, w, a, uv, master, strobe] = channels;

    this.color = this.colorService.toRGB(master, r, g, b, w, a, uv);

    const { classes, duration } = this.colorService.getStrobeClasses(
      strobe,
      0,
      255
    );

    this.strobe = classes;
    this.duration = duration;
  }

  @HostListener('click')
  onClick() {
    this.dialog.open(DeviceConfigModalComponent, {
      data: {
        id: this.id,
      },
    });
  }
}
