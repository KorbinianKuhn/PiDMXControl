import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTesterComponent } from './device-tester.component';

describe('DeviceTesterComponent', () => {
  let component: DeviceTesterComponent;
  let fixture: ComponentFixture<DeviceTesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DeviceTesterComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DeviceTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
