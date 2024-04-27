import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverrideProgramButtonComponent } from './override-program-button.component';

describe('OverrideProgramButtonComponent', () => {
  let component: OverrideProgramButtonComponent;
  let fixture: ComponentFixture<OverrideProgramButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverrideProgramButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverrideProgramButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
