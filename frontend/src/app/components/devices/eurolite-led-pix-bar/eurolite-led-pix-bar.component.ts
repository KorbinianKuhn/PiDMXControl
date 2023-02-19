import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eurolite-led-pix-bar',
  templateUrl: './eurolite-led-pix-bar.component.html',
  styleUrls: ['./eurolite-led-pix-bar.component.scss'],
})
export class EuroliteLedPixBarComponent implements OnInit {
  public color = 'rgba(0,0,0,255)';

  constructor() {}

  ngOnInit(): void {}
}
