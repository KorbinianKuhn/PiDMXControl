import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardColorsComponent } from './board-colors.component';

describe('BoardColorsComponent', () => {
  let component: BoardColorsComponent;
  let fixture: ComponentFixture<BoardColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardColorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
