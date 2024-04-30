import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeamerComponent } from './beamer.component';

describe('BeamerComponent', () => {
  let component: BeamerComponent;
  let fixture: ComponentFixture<BeamerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BeamerComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BeamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
