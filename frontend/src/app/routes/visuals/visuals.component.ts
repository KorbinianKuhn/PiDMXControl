import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { VideoService } from '../../services/video.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html',
  styleUrls: ['./visuals.component.scss'],
  standalone: true,
  imports: [LetDirective, NgClass],
})
export class VisualsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement')
  private videoElement!: ElementRef<HTMLVideoElement>;

  private destroy$$ = new Subject<void>();
  private timer!: NodeJS.Timeout;

  public text$ = this.videoService.text$;
  public video$ = this.videoService.video$;
  public crop$ = this.wsService.visualsSettings$.pipe(
    tap((visuals) => console.log(visuals)),
    map((visuals) => ({
      left: visuals.left,
      right: 100 - visuals.right,
      top: visuals.top,
      bottom: 100 - visuals.bottom,
    }))
  );
  public color$ = this.wsService.visualsSettings$.pipe(
    map((visuals) => visuals.color)
  );

  constructor(
    private elementRef: ElementRef,
    private videoService: VideoService,
    private wsService: WSService
  ) {}

  ngOnInit() {}

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
      if (this.videoElement?.nativeElement) {
        this.videoService.setVideoElement(this.videoElement.nativeElement);
        clearInterval(this.timer);
      }
    }, 50);
  }

  onLoadedMetadata() {
    this.videoService.onVideoElementMetadataLoaded(
      this.videoElement.nativeElement
    );
  }
}
