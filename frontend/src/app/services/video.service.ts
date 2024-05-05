import { Injectable } from '@angular/core';
import { Subject, combineLatest, map, timer } from 'rxjs';
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
  crop: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private address = 146;
  private numChannels = 5;
  private messages: string[] = [
    `Wonderland`,
    `Have I gone mad?`,
    `Imagine`,
    `Who in the world am I?`,
    `Belief`,
    `We are all crazy!`,
    `Reality`,
    `Not all who wander are lost.`,
    `Dream`,
    `I'm not all there myself.`,
    `Existence`,
    `Curiouser and curiouser!`,
  ];

  public text$ = new Subject<AnimatedText>();
  public enableText = false;
  public video$ = new Subject<VideoState>();

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
        const opacity = master / 255;

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
          crop: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          },
        });
      });

    if (this.enableText) {
      combineLatest([
        timer(0, 30000).pipe(map((i) => i % 2 !== 0)),
        timer(0, 60000).pipe(
          map((i) => {
            const message = this.messages[i % this.messages.length];
            return message;
          })
        ),
      ]).subscribe(([show, message]) => {
        this.text$.next({
          message,
          opacity: show ? 1 : 0,
          transform: '',
        });
      });
    }
  }

  setVideoElement(element: HTMLVideoElement) {
    const visuals = this.wsService.visuals$.getValue();

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
    const visuals = this.wsService.visuals$.getValue();
    if (visuals.currentIndex >= 0) {
      const timeElapsed =
        (new Date().valueOf() - new Date(visuals.startedAt).valueOf()) / 1000;
      const currentTime = timeElapsed % element.duration;
      element.currentTime = currentTime;
      element.play();
    }
  }
}
