import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadButtonComponent } from './pad-button.component';

describe('PadButtonComponent', () => {
  let component: PadButtonComponent;
  let fixture: ComponentFixture<PadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PadButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
