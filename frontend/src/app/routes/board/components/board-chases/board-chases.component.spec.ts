import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardChasesComponent } from './board-chases.component';

describe('BoardChasesComponent', () => {
  let component: BoardChasesComponent;
  let fixture: ComponentFixture<BoardChasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardChasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardChasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
