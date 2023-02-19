import { Component, OnInit } from '@angular/core';
import { ChaseColor, ChaseName } from '../../services/ws.interfaces';
import { WSService } from '../../services/ws.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public chaseNameEnum = ChaseName;
  public chaseColorEnum = ChaseColor;

  public bpm$ = this.wsService.bpm$;
  public black$ = this.wsService.black$;
  public master$ = this.wsService.master$;
  public colors$ = this.wsService.colors$;
  public chaseName$ = this.wsService.chaseName$;

  constructor(private wsService: WSService) {}

  ngOnInit(): void {}

  isColorActive(color: ChaseColor) {
    return this.colors$.getValue().includes(color);
  }

  isChaseActive(chaseName: ChaseName) {
    return this.chaseName$.getValue() === chaseName;
  }

  onClickBlack() {
    const value = this.black$.getValue();
    this.wsService.setBlack(!value);
  }

  onClickToggleColor(color: ChaseColor) {
    const colors = this.colors$.getValue();
    const index = colors.indexOf(color);
    if (index === -1) {
      colors.push(color);
    } else {
      colors.splice(index, 1);
    }
    this.wsService.setColors(colors);
  }

  onClickChase(name: ChaseName) {
    this.wsService.setChaseName(name);
  }
}
