import { Injectable } from '@angular/core';
import { Subject, combineLatest, map, timer } from 'rxjs';

export interface AnimatedText {
  message: string;
  opacity: number;
  transform: string;
}

@Injectable({
  providedIn: 'root',
})
export class TextAnimationService {
  public messages: string[] = [
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

  constructor() {
    combineLatest([
      timer(0, 30000).pipe(map((i) => i % 2)),
      timer(0, 60000).pipe(
        map((i) => {
          const message = this.messages[i % this.messages.length];
          return message;
        })
      ),
      // timer(0, 100).pipe(
      //   map(() => {
      //     return `translate(${this.random(-5, 5)}px, ${this.random(-5, 5)}px)`;
      //   })
      // ),
    ]).subscribe(([show, message]) => {
      this.text$.next({
        message,
        opacity: show ? 0 : 1,
        transform: '',
      });
    });
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
