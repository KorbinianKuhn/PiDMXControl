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
      const videoElement = this.videoElement();
      if (!videoElement) {
        return;
      }

      const _ = this.wsService.visualsSource();

      this.videoService.setVideoElement(videoElement.nativeElement);
    });
  }

  onLoadedMetadata(videoElement: HTMLVideoElement) {
    this.videoService.onVideoElementMetadataLoaded(videoElement);
  }

  @HostListener('click')
  onClick() {
    this.elementRef.nativeElement.requestFullscreen() ||
      this.elementRef.nativeElement.webkitRequestFullscreen();
  }
}
