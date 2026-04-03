import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  inject,
  viewChild
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { VideoService } from '../../services/video.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html',
  styleUrls: ['./visuals.component.scss'],
  imports: [NgClass],
})
export class VisualsComponent implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private videoService = inject(VideoService);
  private wsService = inject(WSService);

  private readonly videoElement = viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  private destroy$$ = new Subject<void>();
  private timer!: NodeJS.Timeout;

  public text = toSignal(this.videoService.text$);
  public video = toSignal(this.videoService.video$);
  public crop = toSignal(
    this.wsService.visualsSettings$.pipe(
      tap((visuals) => console.log(visuals)),
      map((visuals) => ({
        left: visuals.left,
        right: 100 - visuals.right,
        top: visuals.top,
        bottom: 100 - visuals.bottom,
      })),
    ),
  );
  public color = toSignal(
    this.wsService.visualsSettings$.pipe(map((visuals) => visuals.color)),
  );

  @HostListener('click')
  onClick() {
    this.elementRef.nativeElement.requestFullscreen() ||
      this.elementRef.nativeElement.webkitRequestFullscreen();
  }

  ngAfterViewInit(): void {
    this.wsService.visualsSource$
      .pipe(takeUntil(this.destroy$$))
      .subscribe(() => {
        this.updateVideo();
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  updateVideo() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      const videoElement = this.videoElement();
      if (videoElement?.nativeElement) {
        this.videoService.setVideoElement(videoElement.nativeElement);
        clearInterval(this.timer);
      }
    }, 50);
  }

  onLoadedMetadata() {
    this.videoService.onVideoElementMetadataLoaded(
      this.videoElement().nativeElement,
    );
  }
}
