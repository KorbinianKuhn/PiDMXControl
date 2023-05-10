import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest, debounceTime, filter } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { VideoService } from '../../../services/video.service';
import { WSService } from '../../../services/ws.service';
import { DeviceConfigModalComponent } from '../../device-config-modal/device-config-modal.component';

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
    this.dialog.open(DeviceConfigModalComponent, {
      data: {
        id: this.id,
      },
    });
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
