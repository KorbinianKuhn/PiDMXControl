import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { VideoService } from '../../services/video.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html',
  styleUrls: ['./visuals.component.scss'],
  imports: [],
})
export class VisualsComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private videoService = inject(VideoService);
  private wsService = inject(WSService);
  private mqttService = inject(MqttService);

  private readonly videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  protected readonly text = this.videoService.text;
  protected readonly video = this.videoService.dmxVideo;
  protected readonly crop = computed(() => {
    const beamer = this.wsService
      .deviceConfigs()
      .find((o) => o.id === 'beamer');

    if (!beamer) {
      return { left: 0, right: 0, top: 0, bottom: 0 };
    }

    return {
      left: beamer.left!,
      right: beamer.right!,
      top: beamer.top!,
      bottom: beamer.bottom!,
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

  ngOnInit(): void {
    this.mqttService.subscribe('dmx');
  }

  ngOnDestroy(): void {
    this.mqttService.unsubscribe('dmx');
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
