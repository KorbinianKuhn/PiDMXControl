import { Component } from '@angular/core';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-beamer',
  templateUrl: './beamer.component.html',
  styleUrls: ['./beamer.component.scss'],
})
export class BeamerComponent {
  public text$ = this.videoService.text$;
  public video$ = this.videoService.video$;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {}
}
