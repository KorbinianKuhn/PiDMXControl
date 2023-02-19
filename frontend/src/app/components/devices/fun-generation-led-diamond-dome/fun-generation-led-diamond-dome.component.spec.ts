import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunGenerationLedDiamondDomeComponent } from './fun-generation-led-diamond-dome.component';

describe('FunGenerationLedDiamondDomeComponent', () => {
  let component: FunGenerationLedDiamondDomeComponent;
  let fixture: ComponentFixture<FunGenerationLedDiamondDomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunGenerationLedDiamondDomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunGenerationLedDiamondDomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
