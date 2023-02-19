import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarytecHeroWashComponent } from './varytec-hero-wash.component';

describe('VarytecHeroWashComponent', () => {
  let component: VarytecHeroWashComponent;
  let fixture: ComponentFixture<VarytecHeroWashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarytecHeroWashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VarytecHeroWashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
