import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-pad-button',
  templateUrl: './pad-button.component.html',
  styleUrls: ['./pad-button.component.scss'],
  standalone: true,
  imports: [NgClass, LetDirective],
})
export class PadButtonComponent implements OnInit {
  @Input() color!: string;
  @Input() active: boolean = true;
  @Input() current: boolean | null = false;
  @Input() size: 'small' | 'normal' = 'normal';
  @Input() progress!: number;

  public performanceMode$ = this.configService.performanceMode$;

  get opacity(): number {
    if (this.current) {
      return 20;
    }
    return this.active ? 10 : 70;
  }

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {}

  onClick() {
    // this.active = !this.active;
  }
}
