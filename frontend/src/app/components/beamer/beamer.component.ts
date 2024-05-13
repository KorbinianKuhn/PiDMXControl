import { AsyncPipe, NgClass } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective } from '@ngrx/component';
import { Subject, combineLatest, filter, map, takeUntil } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { VideoService } from '../../services/video.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-beamer',
  templateUrl: './beamer.component.html',
  styleUrls: ['./beamer.component.scss'],
  standalone: true,
  imports: [LetDirective, NgClass, AsyncPipe, MatIconModule],
})
export class BeamerComponent {
  @Input() id!: string;

  @ViewChild('videoElement', { static: false })
  private videoElement!: ElementRef<HTMLVideoElement>;

  private destroy$$ = new Subject<void>();

  private timer!: NodeJS.Timeout;

  public show$ = combineLatest([
    this.configService.visualisation$,
    this.configService.video$,
    this.wsService.visualsSource$,
  ]).pipe(
    map(([visible, video, index]) => {
      if (!visible || index === -1) {
        return 'hidden';
      }
      return video ? 'video' : 'color';
    })
  );

  public video$ = this.videoService.video$;

  public text$ = this.videoService.text$;

  public videoSelected$ = this.wsService.visualsSource$.pipe(
    map((index) => index > -1)
  );
  public color$ = this.wsService.visualsSettings$.pipe(
    map((visuals) => visuals.color)
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
        // debounceTime(100),
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
