import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  filter,
  interval,
  map,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { ColorService } from './color.service';
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
  private address = 146;
  private numChannels = 5;
  private messages: string[] = [
    `Space`,
    `Time`,
    `Universe`,
    `Life`,
    `Galaxy`,
    `Infinity`,
    `Existence`,
    `Travel`,
    `Dimension`,
  ];

  public text$ = new BehaviorSubject<AnimatedText>({
    message: '',
    opacity: 0,
    transform: '',
  });
  public video$ = new Subject<VideoState>();
  public visualsSource$ = this.wsService.visualsSource$;
  public visualsSettings$ = this.wsService.visualsSettings$;

  constructor(
    private wsService: WSService,
    private colorService: ColorService,
    private mqttService: MqttService
  ) {
    this.mqttService.dmx$
      .pipe(
        map((data) => data.slice(this.address, this.address + this.numChannels))
      )
      .subscribe((channels) => {
        const [r, g, b, master, strobe] = channels;

        const color = this.colorService.toRGB(255, r, g, b, 0, 0, 0);
        const opacity =
          this.visualsSettings$.getValue().opacity === 'chase'
            ? master / 255
            : 1;

        const { classes, duration } = this.colorService.getStrobeClasses(
          strobe,
          0,
          255
        );

        this.video$.next({
          color,
          opacity,
          strobe: {
            classes,
            duration,
          },
        });
      });

    combineLatest([this.visualsSettings$, interval(10000)])
      .pipe(filter(([visuals, counter]) => visuals.text))
      .subscribe(([_, counter]) => {
        const show = counter % 5 === 0;
        let message = this.text$.getValue().message;
        if (show) {
          const index = this.messages.indexOf(message) ?? 0;
          message = this.messages[(index + 1) % this.messages.length];
        }
        this.text$.next({
          message,
          opacity: show ? 1 : 0,
          transform: '',
        });
      });
  }

  setVideoElement(element: HTMLVideoElement) {
    const visuals = this.wsService.visualsSettings$.getValue();

    element.pause();
    if (visuals.currentIndex < 0) {
      element.removeAttribute('src');
    } else {
      const src = `${environment.baseRestApi}/static/visuals/${
        visuals.sources[visuals.currentIndex].url
      }`;
      element.setAttribute('src', src);
      element.setAttribute('type', 'video/mp4');
    }
    element.load();
  }

  onVideoElementMetadataLoaded(element: HTMLVideoElement) {
    const visuals = this.wsService.visualsSettings$.getValue();
    if (visuals.currentIndex >= 0) {
      const timeElapsed =
        (new Date().valueOf() - new Date(visuals.startedAt).valueOf()) / 1000;
      const currentTime = timeElapsed % element.duration;
      element.currentTime = currentTime;
      element.play();
    }
  }
}
