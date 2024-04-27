import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeopixelStripComponent } from './neopixel-strip.component';

describe('NeopixelStripComponent', () => {
  let component: NeopixelStripComponent;
  let fixture: ComponentFixture<NeopixelStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeopixelStripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeopixelStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
