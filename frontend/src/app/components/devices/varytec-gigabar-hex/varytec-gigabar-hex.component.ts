import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-varytec-gigabar-hex',
  templateUrl: './varytec-gigabar-hex.component.html',
  styleUrls: ['./varytec-gigabar-hex.component.scss'],
})
export class VarytecGigabarHexComponent implements OnInit {
  @Input() vertical = false;

  constructor() {}

  ngOnInit(): void {}
}
