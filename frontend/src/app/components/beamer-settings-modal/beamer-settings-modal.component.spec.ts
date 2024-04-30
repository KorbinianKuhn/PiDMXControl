import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeamerSettingsModalComponent } from './beamer-settings-modal.component';

describe('BeamerSettingsModalComponent', () => {
  let component: BeamerSettingsModalComponent;
  let fixture: ComponentFixture<BeamerSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BeamerSettingsModalComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BeamerSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
