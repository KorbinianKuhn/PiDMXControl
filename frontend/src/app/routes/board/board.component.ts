import { Component, OnInit } from '@angular/core';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public bpm$ = this.wsService.bpm$;
  public black$ = this.wsService.black$;
  public master$ = this.wsService.master$;

  constructor(private wsService: WSService) {}

  ngOnInit(): void {}

  onClickBlack() {
    const value = this.black$.getValue();
    this.wsService.setBlack(!value);
  }
}
