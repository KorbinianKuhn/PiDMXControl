import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaseButtonComponent } from './chase-button.component';

describe('ChaseButtonComponent', () => {
  let component: ChaseButtonComponent;
  let fixture: ComponentFixture<ChaseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ChaseButtonComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ChaseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
