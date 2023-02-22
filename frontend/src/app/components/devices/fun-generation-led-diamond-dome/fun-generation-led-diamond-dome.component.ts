import { Component, Input, OnInit } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { ColorService } from '../../../services/color.service';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-fun-generation-led-diamond-dome',
  templateUrl: './fun-generation-led-diamond-dome.component.html',
  styleUrls: ['./fun-generation-led-diamond-dome.component.scss'],
})
export class FunGenerationLedDiamondDomeComponent implements OnInit {
  @Input() address!: number;

  private destroy$$ = new Subject<void>();
  private numChannels = 9;

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
    const [r, g, b, w, a, uv, strobe, movement] = channels;

    this.color = this.colorService.toRGB(255, r, g, b, w, a, uv);

    const { classes, duration } = this.colorService.getStrobeClasses(
      strobe,
      10,
      255
    );

    this.strobe = classes;
    this.duration = duration;
  }
}
