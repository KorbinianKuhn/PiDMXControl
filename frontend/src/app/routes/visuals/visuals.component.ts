import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, map, takeUntil } from 'rxjs';
import { ColorService } from '../../services/color.service';
import {
  AnimatedText,
  TextAnimationService,
} from '../../services/text-animation.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html',
  styleUrls: ['./visuals.component.scss'],
})
export class VisualsComponent implements OnInit, OnDestroy {
  private address = 146;
  private destroy$$ = new Subject<void>();
  private numChannels = 5;

  public color: string = 'rgba(0,0,0,1)';
  public textColor: string = 'rgba(0,0,0,1)';
  public duration!: string;
  public strobe!: string;

  public containerStyles: any;

  public crop$ = new BehaviorSubject<any>({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  public text!: AnimatedText;

  constructor(
    private wsService: WSService,
    private colorService: ColorService,
    private textAnimationService: TextAnimationService
  ) {}

  ngOnInit(): void {
    this.wsService.dmx$
      .pipe(
        takeUntil(this.destroy$$),
        map((data) => data.slice(this.address, this.address + this.numChannels))
      )
      .subscribe((channels) => this.updateColor(channels));

    this.textAnimationService.text$
      .pipe(takeUntil(this.destroy$$))
      .subscribe((v) => (this.text = v));
  }

  ngOnDestroy() {
    this.destroy$$.next();
  }

  updateColor(channels: number[]) {
    const [r, g, b, master, strobe] = channels;

    this.color = this.colorService.toRGB(master, r, g, b, 0, 0, 0);
    this.textColor = this.colorService.toRGB(255, r, g, b, 0, 0, 0);

    const { classes, duration } = this.colorService.getStrobeClasses(
      strobe,
      0,
      255
    );

    this.strobe = classes;
    this.duration = duration;
  }
}
