import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Device } from '../../interfaces/general.interfaces';
import { WSService } from '../../services/ws.service';
import { MatSliderModule } from '@angular/material/slider';


@Component({
    selector: 'app-device-tester',
    templateUrl: './device-tester.component.html',
    styleUrls: ['./device-tester.component.scss'],
    imports: [MatSliderModule]
})
export class DeviceTesterComponent implements OnInit, OnDestroy {
  private wsService = inject(WSService);

  readonly device = input.required<Device>();

  private destroy$$ = new Subject<void>();

  public values: number[] = [];

  constructor() {
    this.wsService;
  }

  ngOnInit(): void {
    this.wsService.settingsData$
      .pipe(takeUntil(this.destroy$$))
      .subscribe((data) => (this.values = this.slice(data)));

    this.values = this.slice(this.wsService.settingsData$.getValue());
  }

  private slice(buffer: number[]): number[] {
    return buffer.slice(
      this.device().address,
      this.device().address + this.device().channels.length
    );
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  onValueChange(address: number, value: number) {
    this.wsService.setSettingsChannel(address, value);
  }
}
