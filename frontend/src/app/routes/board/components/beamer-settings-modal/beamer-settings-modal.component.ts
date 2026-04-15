import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { PadButtonComponent } from '../../../../components/pad-button/pad-button.component';
import { PanelGroupComponent } from '../../../../components/panel-group/panel-group.component';
import { ConfigService } from '../../../../services/config.service';
import { DeviceService } from '../../../../services/device.service';
import { WSService } from '../../../../services/ws.service';

@Component({
  selector: 'app-beamer-settings-modal',
  templateUrl: './beamer-settings-modal.component.html',
  styleUrls: ['./beamer-settings-modal.component.scss'],
  imports: [
    TitleCasePipe,
    MatCheckbox,
    PanelGroupComponent,
    PadButtonComponent,
  ],
})
export class BeamerSettingsModalComponent {
  private wsService = inject(WSService);
  private configService = inject(ConfigService);
  private deviceService = inject(DeviceService);

  protected readonly disabled = computed(
    () => this.deviceService.beamer()?.disabled ?? false,
  );
  protected readonly visuals = this.wsService.visuals;
  protected readonly performanceMode = this.configService.performanceMode;

  onVisualIndexChange(event: MatRadioChange<number>) {
    this.wsService.setVisualsSource(event.value);
  }

  onClickVideo(index: number) {
    const value = index === this.visuals().currentIndex ? -1 : index;
    this.wsService.setVisualsSource(value);
  }

  onToggleColor() {
    const visuals = this.visuals()!;
    const color = visuals.color === 'chase' ? 'original' : 'chase';
    this.wsService.setVisualsSettings({ color });
  }

  onToggleOpacity() {
    const visuals = this.visuals()!;
    const opacity = visuals.opacity === 'chase' ? 'off' : 'chase';
    this.wsService.setVisualsSettings({ opacity });
  }

  onToggleText() {
    const { showText } = this.visuals()!;
    this.wsService.setVisualsSettings({ showText: !showText });
  }

  onToggleInvert() {
    const visuals = this.visuals()!;
    const invert = !visuals.invert;
    this.wsService.setVisualsSettings({ invert });
  }

  onToggleDisabled() {
    const device = this.wsService
      .deviceConfigs()
      .find((o) => o.id === 'beamer');
    if (device) {
      device.disabled = !device.disabled;
      this.wsService.setDeviceConfig(device.id, device);
    }
  }
}
