import { Component, Input, OnInit } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { ColorService } from '../../../services/color.service';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-adj-saber-spot',
  templateUrl: './adj-saber-spot.component.html',
  styleUrls: ['./adj-saber-spot.component.scss'],
})
export class AdjSaberSpotComponent implements OnInit {
  @Input() address!: number;

  private destroy$$ = new Subject<void>();
  private numChannels = 6;

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
    const [strobe, r, g, b, w, master] = channels;

    this.color = this.colorService.toRGB(master, r, g, b, w, 0, 0);

    const { classes, duration } = this.colorService.getStrobeClasses(
      strobe,
      64,
      95
    );

    this.strobe = classes;
    this.duration = duration;
  }
}
