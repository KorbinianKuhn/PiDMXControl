import {
  Component,
  ElementRef,
  effect,
  inject,
  input,
  viewChild
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, map } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { VideoService } from '../../services/video.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-beamer',
  templateUrl: './beamer.component.html',
  styleUrls: ['./beamer.component.scss'],
  imports: [MatIconModule],
})
export class BeamerComponent {
  private videoService = inject(VideoService);
  private configService = inject(ConfigService);
  private wsService = inject(WSService);

  readonly id = input.required<string>();

  private readonly videoElement = viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  private timer!: NodeJS.Timeout;

  protected readonly show = toSignal(
    combineLatest([
      this.configService.visualisation$,
      this.configService.video$,
      this.wsService.visualsSource$,
    ]).pipe(
      map(([visible, video, index]) => {
        if (!visible || index === -1) {
          return 'hidden';
        }
        return video ? 'video' : 'color';
      }),
    ),
  );

  protected readonly video = toSignal(this.videoService.video$);

  protected readonly text = toSignal(this.videoService.text$);

  protected readonly videoSelected = toSignal(
    this.wsService.visualsSource$.pipe(map((index) => index > -1)),
  );
  protected readonly color = toSignal(
    this.wsService.visualsSettings$.pipe(map((visuals) => visuals.color)),
  );

  constructor() {
    effect(() => {
      if (this.show() === 'video') {
        this.updateVideo();
      }
    });
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
