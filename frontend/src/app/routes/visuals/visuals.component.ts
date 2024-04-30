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
import { Subject, debounceTime, takeUntil } from 'rxjs';
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

  public text$ = this.videoService.text$;
  public video$ = this.videoService.video$;

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
    this.wsService.visuals$
      .pipe(takeUntil(this.destroy$$), debounceTime(1000))
      .subscribe(() => {
        this.updateVideo();
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  updateVideo() {
    if (this.videoElement) {
      this.videoService.setVideoElement(this.videoElement.nativeElement);
    }
  }

  onLoadedMetadata() {
    this.videoService.onVideoElementMetadataLoaded(
      this.videoElement.nativeElement
    );
  }
}
