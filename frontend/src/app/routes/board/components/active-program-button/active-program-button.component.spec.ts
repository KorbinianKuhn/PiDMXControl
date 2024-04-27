import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveProgramButtonComponent } from './active-program-button.component';

describe('ActiveProgramButtonComponent', () => {
  let component: ActiveProgramButtonComponent;
  let fixture: ComponentFixture<ActiveProgramButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveProgramButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveProgramButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
