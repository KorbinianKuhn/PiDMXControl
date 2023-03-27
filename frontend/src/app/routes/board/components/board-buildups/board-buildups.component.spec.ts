import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardBuildupsComponent } from './board-buildups.component';

describe('BoardBuildupsComponent', () => {
  let component: BoardBuildupsComponent;
  let fixture: ComponentFixture<BoardBuildupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardBuildupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardBuildupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
