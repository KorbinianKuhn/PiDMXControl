import { Component } from '@angular/core';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html',
  styleUrls: ['./visuals.component.scss'],
})
export class VisualsComponent {
  public text$ = this.videoService.text$;
  public video$ = this.videoService.video$;

  constructor(private videoService: VideoService) {}
}
