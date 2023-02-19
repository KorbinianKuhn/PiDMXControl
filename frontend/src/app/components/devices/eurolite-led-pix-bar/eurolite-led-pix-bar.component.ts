import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-eurolite-led-pix-bar',
  templateUrl: './eurolite-led-pix-bar.component.html',
  styleUrls: ['./eurolite-led-pix-bar.component.scss'],
})
export class EuroliteLedPixBarComponent implements OnInit, OnDestroy {
  @Input() address!: number;

  private destroy$$ = new Subject<void>();
  private numChannels = 8 * 6;

  public colors = new Array(8).fill('rgba(0,0,0,255)');

  constructor(private wsService: WSService) {}

  ngOnInit(): void {
    this.wsService.dmx$
      .pipe(
        takeUntil(this.destroy$$),
        map((data) =>
          data.slice(this.address, this.address + this.numChannels - 1)
        )
      )
      .subscribe((channels) => this.updateColor(channels));
  }

  ngOnDestroy() {
    this.destroy$$.next();
  }

  updateColor(channels: number[]) {
    for (let segment = 0; segment < 8; segment++) {
      const offset = segment * 6;
      const [master, strobe, red, green, blue] = channels.slice(
        offset,
        offset + 6
      );

      if (master === 0) {
        this.colors[segment] = 'rgba(0,0,0,255)';
      } else {
        this.colors[segment] = `rgba(${red},${green},${blue},${master})`;
      }
    }
  }
}
