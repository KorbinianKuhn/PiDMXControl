import { Injectable, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, filter, interval, map } from 'rxjs';
import { ColorService } from './color.service';
import { EnvService } from './env.service';
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
  private colorService = inject(ColorService);
  private mqttService = inject(MqttService);
  private envService = inject(EnvService);

  private address = 146;
  private numChannels = 5;
  private messages: string[] = [`Space Rave`]; // TODO: make tests adjustable thorugh app

  public readonly visualsSettings = this.wsService.visualsSettings;

  private getVideo(channels: number[]) {
    const [r, g, b, master, strobe] = channels;

    const color = this.colorService.toRGB(255, r, g, b, 0, 0, 0);
    const opacity =
      this.visualsSettings().opacity === 'chase' ? master / 255 : 1;

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
    combineLatest([toObservable(this.visualsSettings), interval(10000)]).pipe(
      filter(([visuals, _]) => visuals.text),
      map(([_, counter]) => {
        const show = counter % 5 === 0;
        let message = this.messages[0];
        if (show) {
          const index = this.messages.indexOf(message) ?? 0;
          message = this.messages[(index + 1) % this.messages.length];
        }
        return {
          message,
          opacity: show ? 1 : 0,
          transform: '',
        };
      }),
    ),
  );

  setVideoElement(element: HTMLVideoElement) {
    const visuals = this.wsService.visualsSettings();

    element.pause();
    if (visuals.currentIndex < 0) {
      element.removeAttribute('src');
    } else {
      const src = `${this.envService.baseRestApi}/static/visuals/${
        visuals.sources[visuals.currentIndex].url
      }`;
      element.setAttribute('src', src);
      element.setAttribute('type', 'video/mp4');
    }
    element.load();
  }

  onVideoElementMetadataLoaded(element: HTMLVideoElement) {
    const visuals = this.wsService.visualsSettings();
    if (visuals.currentIndex >= 0) {
      const timeElapsed =
        (new Date().valueOf() - new Date(visuals.startedAt).valueOf()) / 1000;
      const currentTime = timeElapsed % element.duration;
      element.currentTime = currentTime;
      element.play();
    }
  }
}
