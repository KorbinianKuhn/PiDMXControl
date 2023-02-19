import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjSaberSpotComponent } from './adj-saber-spot.component';

describe('AdjSaberSpotComponent', () => {
  let component: AdjSaberSpotComponent;
  let fixture: ComponentFixture<AdjSaberSpotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjSaberSpotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjSaberSpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
