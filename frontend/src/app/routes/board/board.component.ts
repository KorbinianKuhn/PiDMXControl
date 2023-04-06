import { Component, OnInit } from '@angular/core';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public master$ = this.wsService.master$;
  public ambientUV$ = this.wsService.ambientUV$;

  constructor(private wsService: WSService) {}

  ngOnInit(): void {}

  onMasterChange(value: any) {
    this.wsService.setMaster(value);
  }

  onAmbientUVChange(value: any) {
    this.wsService.setAmbientUV(value);
  }
}
