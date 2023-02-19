import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarytecGigabarHexComponent } from './varytec-gigabar-hex.component';

describe('VarytecGigabarHexComponent', () => {
  let component: VarytecGigabarHexComponent;
  let fixture: ComponentFixture<VarytecGigabarHexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarytecGigabarHexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VarytecGigabarHexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
