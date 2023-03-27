import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Subject } from 'rxjs';
import { WSService } from '../../services/ws.service';
import { BpmModalComponent } from './bpm-modal/bpm-modal.component';

@Component({
  selector: 'app-bpm',
  templateUrl: './bpm.component.html',
  styleUrls: ['./bpm.component.scss'],
})
export class BpmComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();

  public bpm$ = this.wsService.bpm$;
  public bars$ = this.wsService.tick$.pipe(
    map((value) => {
      const values = [false, false, false, false];
      values[value] = true;
      return values;
    })
  );

  constructor(private wsService: WSService, private matDialog: MatDialog) {}

  ngOnInit(): void {
    // this.tap$.pipe(takeUntil(this.destroy$$), ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  onClick() {
    this.matDialog.open(BpmModalComponent);
  }
}
