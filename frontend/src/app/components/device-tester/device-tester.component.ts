import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Device } from '../../interfaces/general.interfaces';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-device-tester',
  templateUrl: './device-tester.component.html',
  styleUrls: ['./device-tester.component.scss'],
})
export class DeviceTesterComponent implements OnInit, OnDestroy {
  @Input() device!: Device;

  private destroy$$ = new Subject<void>();

  public values: number[] = [];

  constructor(private wsService: WSService) {
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
      this.device.address,
      this.device.address + this.device.channels.length
    );
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  onValueChange(address: number, value: number) {
    this.wsService.setSettingsChannel(address, value);
  }
}
