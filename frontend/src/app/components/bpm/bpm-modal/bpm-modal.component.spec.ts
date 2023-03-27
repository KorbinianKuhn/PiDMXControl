import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmModalComponent } from './bpm-modal.component';

describe('BpmModalComponent', () => {
  let component: BpmModalComponent;
  let fixture: ComponentFixture<BpmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
