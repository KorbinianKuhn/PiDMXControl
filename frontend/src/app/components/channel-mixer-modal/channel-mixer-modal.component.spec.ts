import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMixerModalComponent } from './channel-mixer-modal.component';

describe('ChannelMixerModalComponent', () => {
  let component: ChannelMixerModalComponent;
  let fixture: ComponentFixture<ChannelMixerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelMixerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelMixerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
