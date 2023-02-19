import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardOverridesComponent } from './board-overrides.component';

describe('BoardOverridesComponent', () => {
  let component: BoardOverridesComponent;
  let fixture: ComponentFixture<BoardOverridesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardOverridesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardOverridesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
