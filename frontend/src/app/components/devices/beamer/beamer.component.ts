import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest, debounceTime, filter, takeUntil } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { VideoService } from '../../../services/video.service';
import { WSService } from '../../../services/ws.service';
import { BeamerSettingsModalComponent } from '../../beamer-settings-modal/beamer-settings-modal.component';

@Component({
  selector: 'app-beamer',
  templateUrl: './beamer.component.html',
  styleUrls: ['./beamer.component.scss'],
})
export class BeamerComponent {
  @Input() id!: string;

  @ViewChild('videoElement')
  private videoElement!: ElementRef<HTMLVideoElement>;

  private destroy$$ = new Subject<void>();

  public text$ = this.videoService.text$;
  public video$ = this.videoService.video$;
  public visualisation$ = this.configService.visualisation$;
  public showVideo$ = this.configService.video$;

  constructor(
    private videoService: VideoService,
    private configService: ConfigService,
    private dialog: MatDialog,
    private wsService: WSService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    combineLatest([this.visualisation$, this.wsService.visuals$])
      .pipe(
        takeUntil(this.destroy$$),
        debounceTime(1000),
        filter(([visible, visuals]) => visible)
      )
      .subscribe(() => {
        this.updateVideo();
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  @HostListener('click')
  onClick() {
    this.dialog.open(BeamerSettingsModalComponent);
  }

  updateVideo() {
    if (this.videoElement) {
      this.videoService.setVideoElement(this.videoElement.nativeElement);
    }
  }

  onLoadedMetadata() {
    this.videoService.onVideoElementMetadataLoaded(
      this.videoElement.nativeElement
    );
  }
}
