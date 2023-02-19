import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EuroliteLedPixBarComponent } from './eurolite-led-pix-bar.component';

describe('EuroliteLedPixBarComponent', () => {
  let component: EuroliteLedPixBarComponent;
  let fixture: ComponentFixture<EuroliteLedPixBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EuroliteLedPixBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EuroliteLedPixBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
