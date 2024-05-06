import { AsyncPipe, NgClass } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import {
  Subject,
  combineLatest,
  debounceTime,
  filter,
  map,
  takeUntil,
} from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { VideoService } from '../../services/video.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-beamer',
  templateUrl: './beamer.component.html',
  styleUrls: ['./beamer.component.scss'],
  standalone: true,
  imports: [LetDirective, NgClass, AsyncPipe],
})
export class BeamerComponent {
  @Input() id!: string;

  @ViewChild('videoElement')
  private videoElement!: ElementRef<HTMLVideoElement>;

  private destroy$$ = new Subject<void>();

  public show$ = combineLatest([
    this.configService.visualisation$,
    this.configService.video$,
    this.wsService.visuals$,
  ]).pipe(
    map(([visible, video, visuals]) => {
      if (!visible || visuals.currentIndex === -1) {
        return 'hidden';
      }
      return video ? 'video' : 'color';
    })
  );

  public video$ = this.videoService.video$;

  public text$ = this.videoService.text$;

  public videoSelected$ = this.wsService.visuals$.pipe(
    map((visuals) => visuals.currentIndex > -1)
  );

  constructor(
    private videoService: VideoService,
    private configService: ConfigService,
    private wsService: WSService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.show$
      .pipe(
        takeUntil(this.destroy$$),
        debounceTime(100),
        filter((show) => show === 'video')
      )
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
