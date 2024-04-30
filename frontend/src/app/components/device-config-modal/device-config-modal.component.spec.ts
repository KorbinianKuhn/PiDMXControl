import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceConfigModalComponent } from './device-config-modal.component';

describe('DeviceConfigModalComponent', () => {
  let component: DeviceConfigModalComponent;
  let fixture: ComponentFixture<DeviceConfigModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DeviceConfigModalComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DeviceConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
