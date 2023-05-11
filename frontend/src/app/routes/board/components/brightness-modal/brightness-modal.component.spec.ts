import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrightnessModalComponent } from './brightness-modal.component';

describe('BrightnessModalComponent', () => {
  let component: BrightnessModalComponent;
  let fixture: ComponentFixture<BrightnessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrightnessModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrightnessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
