import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ConfigService } from '../../../../../services/config.service';
import { VideoService } from '../../../../../services/video.service';
import { WSService } from '../../../../../services/ws.service';

@Component({
  selector: 'app-beamer',
  templateUrl: './beamer.component.html',
  styleUrls: ['./beamer.component.scss'],
  imports: [MatIcon],
})
export class BeamerComponent {
  private videoService = inject(VideoService);
  private configService = inject(ConfigService);
  private wsService = inject(WSService);

  readonly id = input.required<string>();

  private readonly videoElement =
    viewChild<ElementRef<HTMLVideoElement>>('videoElement');

  protected readonly performanceMode = this.configService.performanceMode;
  protected readonly show = computed(() => {
    if (
      !this.configService.visualisation() ||
      this.wsService.visuals().currentIndex === -1
    ) {
      return 'hidden';
    }

    if (this.performanceMode()) {
      return 'color';
    }

    return this.configService.video() ? 'video' : 'color';
  });
  protected readonly video = this.videoService.visualisationVideo;
  protected readonly text = this.videoService.text;
  protected readonly videoSelected = computed(
    () => this.wsService.visuals().currentIndex > -1,
  );
  protected readonly color = computed(() => this.wsService.visuals().color);
  protected readonly invert = computed(
    () => this.videoService.visuals().invert,
  );

  constructor() {
    effect(() => {
      if (this.show() === 'hidden') {
        return;
      }

      const videoElement = this.videoElement();
      if (!videoElement) {
        return;
      }

      const _ = this.videoService.sourceChanged();

      this.videoService.setVideoElement(videoElement.nativeElement);
    });
  }

  onLoadedMetadata(videoElement: HTMLVideoElement) {
    this.videoService.onVideoElementMetadataLoaded(videoElement);
  }
}
