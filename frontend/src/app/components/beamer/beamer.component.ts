import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
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

  private readonly videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  private timer!: NodeJS.Timeout;

  protected readonly show = computed(() => {
    if (
      !this.configService.visualisation() ||
      this.wsService.visualsSource() === -1
    ) {
      return 'hidden';
    }

    return this.configService.video() ? 'video' : 'color';
  });

  protected readonly video = this.videoService.video;

  protected readonly text = this.videoService.text;

  protected readonly videoSelected = computed(
    () => this.wsService.visualsSource() > -1,
  );

  protected readonly color = computed(
    () => this.wsService.visualsSettings().color,
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
