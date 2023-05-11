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
    `Is this a Dream?`,
    `Have We gone mad?`,
    `We're all mad here!`,
    `Who in the world are We?`,
    `Is this Wonderland or Reality?`,
    `Normality was never an option!`,
    `Would you like an adventure now?`,
    `Shall we have our tea first?`,
    `All the best people are crazy.`,
    `We can't go back to yesterday.`,
    `Not all who wander are lost.`,
    `Our reality is just different than yours.`,
    `We're not quite there either.`,
    'All the best people are crazy',
    `Curiouser and curiouser!`,
    `There is a place like no place on earth.`,
    `A land full of wonder, mystery & danger.`,
    `Enter the rabbithole!`,
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
