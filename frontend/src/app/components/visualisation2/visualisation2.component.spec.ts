import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Visualisation2Component } from './visualisation2.component';

describe('Visualisation2Component', () => {
  let component: Visualisation2Component;
  let fixture: ComponentFixture<Visualisation2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Visualisation2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Visualisation2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
