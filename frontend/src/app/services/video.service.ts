import { Injectable, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, filter, interval, map } from 'rxjs';
import { ColorService } from './color.service';
import { DeviceService } from './device.service';
import { MqttService } from './mqtt.service';
import { WSService } from './ws.service';

export interface AnimatedText {
  message: string;
  opacity: number;
  transform: string;
}

export interface VideoState {
  color: string;
  opacity: number;
  strobe: {
    classes: string;
    duration: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private wsService = inject(WSService);
  private deviceService = inject(DeviceService);
  private colorService = inject(ColorService);
  private mqttService = inject(MqttService);

  private address = 146;
  private numChannels = 5;
  private messages = computed(() =>
    this.wsService
      .visuals()
      .messages.split('\n')
      .map((o) => o.trim())
      .filter((o) => !!o),
  );
  private lastMessage!: string;

  public readonly visuals = this.wsService.visuals;
  public readonly sourceChanged = computed(() => this.visuals().currentIndex);
  private readonly opacity = computed(
    () => this.deviceService.beamer()?.master ?? 255,
  );
  public readonly fontClass = computed(() =>
    this.visuals().font.replaceAll(' ', '-').toLowerCase(),
  );

  private getVideo(channels: number[]) {
    const [r, g, b, master, strobe] = channels;

    const color = this.colorService.toRGB(255, r, g, b, 0, 0, 0);

    const opacity =
      this.visuals().opacity === 'chase' ? master / 255 : this.opacity();

    const { classes, duration } = this.colorService.getStrobeClasses(
      strobe,
      0,
      255,
    );

    return {
      color,
      opacity,
      strobe: {
        classes,
        duration,
      },
    };
  }

  public readonly visualisationVideo = computed(() => {
    const channels = this.mqttService
      .visualisation()
      .slice(this.address, this.address + this.numChannels);

    return this.getVideo(channels);
  });

  public readonly dmxVideo = computed(() => {
    const channels = this.mqttService
      .dmx()
      .slice(this.address, this.address + this.numChannels);

    return this.getVideo(channels);
  });

  public readonly text = toSignal(
    combineLatest([
      toObservable(this.visuals),
      interval(10000),
      toObservable(this.messages),
    ]).pipe(
      filter(([visuals, _]) => visuals.showText),
      map(([_, counter, messages]) => {
        const show = counter % 5 === 0;
        if (show) {
          let index = this.lastMessage
            ? messages.indexOf(this.lastMessage) + 1
            : 0;

          if (index > messages.length - 1) {
            index = 0;
          }
          this.lastMessage = messages[index];
        }
        return {
          message: this.lastMessage,
          opacity: show ? 1 : 0,
          transform: '',
        };
      }),
    ),
  );

  setVideoElement(element: HTMLVideoElement) {
    const visuals = this.wsService.visuals();

    element.pause();
    if (visuals.currentIndex < 0) {
      element.removeAttribute('src');
    } else {
      element.setAttribute('src', visuals.sources[visuals.currentIndex].url);
      element.setAttribute('type', 'video/mp4');
    }
    element.load();
  }

  onVideoElementMetadataLoaded(element: HTMLVideoElement) {
    const visuals = this.wsService.visuals();
    if (visuals.currentIndex >= 0) {
      const timeElapsed =
        (new Date().valueOf() - new Date(visuals.startedAt).valueOf()) / 1000;
      const currentTime = timeElapsed % element.duration;
      element.currentTime = currentTime;
      element.play();
    }
  }
}
