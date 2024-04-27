import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardColorsModalComponent } from './board-colors-modal.component';

describe('BoardColorsModalComponent', () => {
  let component: BoardColorsModalComponent;
  let fixture: ComponentFixture<BoardColorsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardColorsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardColorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
