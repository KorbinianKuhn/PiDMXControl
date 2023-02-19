import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { WSService } from '../../../services/ws.service';

@Component({
  selector: 'app-varytec-gigabar-hex',
  templateUrl: './varytec-gigabar-hex.component.html',
  styleUrls: ['./varytec-gigabar-hex.component.scss'],
})
export class VarytecGigabarHexComponent implements OnInit, OnDestroy {
  @Input() vertical = false;
  @Input() address!: number;

  private destroy$$ = new Subject<void>();
  private numChannels = 9;

  public color: string = 'bg-black';

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
    const [red, green, blue, white, amber, uv, master, strobe] = channels;

    if (master === 0) {
      this.color = 'rgba(0,0,0,255)';
    } else {
      this.color = `rgba(${red},${green},${blue},${master})`;
    }
  }
}
