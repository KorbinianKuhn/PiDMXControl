import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { BehaviorSubject, Subject, map, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ColorService } from '../../services/color.service';
import {
  AnimatedText,
  TextAnimationService,
} from '../../services/text-animation.service';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements AfterViewInit {
  private address = 146;
  private destroy$$ = new Subject<void>();
  private numChannels = 5;

  public color: string = 'rgba(0,0,0,1)';
  public opacity: number = 1;
  public duration!: string;
  public strobe!: string;
  public fontSize: number = 10;
  public strokeWidth: number = 2;

  public crop$ = new BehaviorSubject<any>({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  public text!: AnimatedText;
  public src = `${environment.baseRestApi}/static/visuals/amanda-darling.mp4`;

  constructor(
    private wsService: WSService,
    private colorService: ColorService,
    private textAnimationService: TextAnimationService,
    private elementRef: ElementRef
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

  ngAfterViewInit() {
    this.fontSize = this.elementRef.nativeElement.offsetWidth / 10;
    if (this.fontSize < 20) {
      this.strokeWidth = 1;
    }
  }

  ngOnDestroy() {
    this.destroy$$.next();
  }

  updateColor(channels: number[]) {
    const [r, g, b, master, strobe] = channels;

    this.color = this.colorService.toRGB(255, r, g, b, 0, 0, 0);
    this.opacity = master / 255;

    const { classes, duration } = this.colorService.getStrobeClasses(
      strobe,
      0,
      255
    );

    this.strobe = classes;
    this.duration = duration;
  }
}
