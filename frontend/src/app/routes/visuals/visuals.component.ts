import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { VideoService } from '../../services/video.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html',
  styleUrls: ['./visuals.component.scss'],
  imports: [NgClass],
})
export class VisualsComponent {
  private elementRef = inject(ElementRef);
  private videoService = inject(VideoService);
  private wsService = inject(WSService);

  private readonly videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  private destroy$$ = new Subject<void>();
  private timer!: NodeJS.Timeout;

  protected readonly text = this.videoService.text;
  protected readonly video = this.videoService.video;
  protected readonly crop = computed(() => {
    const visuals = this.wsService.visualsSettings();
    return {
      left: visuals.left,
      right: 100 - visuals.right,
      top: visuals.top,
      bottom: 100 - visuals.bottom,
    };
  });
  protected readonly color = computed(
    () => this.wsService.visualsSettings().color,
  );

  constructor() {
    effect(() => {
      const _ = this.wsService.visualsSource();
      this.updateVideo();
    });
  }

  @HostListener('click')
  onClick() {
    this.elementRef.nativeElement.requestFullscreen() ||
      this.elementRef.nativeElement.webkitRequestFullscreen();
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
