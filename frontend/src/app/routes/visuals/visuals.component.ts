import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { VideoService } from '../../services/video.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html',
  styleUrls: ['./visuals.component.scss'],
})
export class VisualsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement')
  private videoElement!: ElementRef<HTMLVideoElement>;

  private destroy$$ = new Subject<void>();

  public text$ = this.videoService.text$;
  public video$ = this.videoService.video$;

  constructor(
    private videoService: VideoService,
    private wsService: WSService
  ) {}

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
