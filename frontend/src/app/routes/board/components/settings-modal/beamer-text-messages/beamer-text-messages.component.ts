import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';
import { WSService } from '../../../../../services/ws.service';

@Component({
  selector: 'app-beamer-text-messages',
  imports: [],
  templateUrl: './beamer-text-messages.component.html',
  styleUrl: './beamer-text-messages.component.scss',
})
export class BeamerTextMessagesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private changed$ = new Subject<string>();
  private wsService = inject(WSService);

  protected text = computed(() => this.wsService.visuals().messages);

  onTextChange(text: string) {
    this.changed$.next(text);
  }

  ngOnInit(): void {
    this.changed$
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(2000))
      .subscribe((text) => {
        this.wsService.setVisualsSettings({
          messages: text,
        });
      });
  }
}
