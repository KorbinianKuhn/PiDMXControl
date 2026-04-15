import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';
import { PanelGroupComponent } from '../../../../../components/panel-group/panel-group.component';
import { VideoService } from '../../../../../services/video.service';
import { Font } from '../../../../../services/ws.interfaces';
import { WSService } from '../../../../../services/ws.service';

@Component({
  selector: 'app-beamer-text-messages',
  imports: [PanelGroupComponent],
  templateUrl: './beamer-text-messages.component.html',
  styleUrl: './beamer-text-messages.component.scss',
})
export class BeamerTextMessagesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private changed$ = new Subject<string>();
  private wsService = inject(WSService);
  private videoService = inject(VideoService);

  protected fonts = Object.entries(Font).map(([key, value]) => ({
    viewValue: key,
    value,
    class: value.replaceAll(' ', '-').toLowerCase(),
  }));

  protected text = computed(() => this.wsService.visuals().messages);
  protected font = computed(() => this.wsService.visuals().font);
  protected readonly fontClass = this.videoService.fontClass;

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

  onFontChange(value: Font) {
    this.wsService.setVisualsSettings({
      font: value,
    });
  }
}
