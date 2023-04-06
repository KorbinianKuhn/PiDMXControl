import { Component, Input } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { ColorService } from '../../../services/color.service';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-beamer',
  templateUrl: './beamer.component.html',
  styleUrls: ['./beamer.component.scss'],
})
export class BeamerComponent {
  @Input() address!: number;

  private destroy$$ = new Subject<void>();
  private numChannels = 5;

  public color: string = 'rgba(0,0,0,1)';
  public duration!: string;
  public strobe!: string;

  constructor(
    private wsService: WSService,
    private colorService: ColorService
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
    const [r, g, b, master, strobe] = channels;

    this.color = this.colorService.toRGB(master, r, g, b, 0, 0, 0);

    const { classes, duration } = this.colorService.getStrobeClasses(
      strobe,
      0,
      255
    );

    this.strobe = classes;
    this.duration = duration;
  }
}
