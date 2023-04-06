import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmNumberComponent } from './bpm-number.component';

describe('BpmNumberComponent', () => {
  let component: BpmNumberComponent;
  let fixture: ComponentFixture<BpmNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpmNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
