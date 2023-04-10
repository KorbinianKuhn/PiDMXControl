import { mergeDevicePatterns } from '../chase-builder/chase-utils';
import { ChannelAnimation } from '../lib/chase';
import { Config } from '../lib/config';
import {
  ChannelState,
  ChannelType,
  Device,
  DeviceStateValues,
} from '../lib/device';

const CHANNEL_ORDER: ChannelType[] = [
  null, //pan
  null, // pan fine
  null, // tilt
  null, // tilt fine
  null, // speed pan tilt
  ChannelType.MASTER,
  ChannelType.STROBE, // 10-250
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  ChannelType.WHITE,
  ChannelType.AMBER,
  ChannelType.UV,
  null, // color temperature
  null, // color macros
  null, // auto programs
];

export class VarytecHeroWash extends Device {
  constructor(address: number, id: string, config: Config) {
    super(address, id, CHANNEL_ORDER, config);
  }

  state(values: DeviceStateValues): ChannelState[] {
    const channels = this._cloneState();

    Object.keys(values).map((key) => {
      const value = values[key];
      switch (key) {
        case 'r':
          channels[7].value += value;
          break;
        case 'g':
          channels[8].value += value;
          break;
        case 'b':
          channels[9].value += value;
          break;
        case 'w':
          channels[10].value += value;
          break;
        case 'a':
          channels[11].value += value;
          break;
        case 'uv':
          channels[12].value += value;
          break;
        case 'master':
          channels[5].value = value;
          break;
        case 'strobe':
          channels[6].value = this._normalizeStrobeValue(value);
          break;
      }
    });

    return channels;
  }

  animationTop(numSteps: number): ChannelAnimation {
    const steps: ChannelAnimation = [];

    for (let i = 0; i < numSteps; i++) {
      steps.push([
        {
          address: this.address + 0,
          value: 0,
        },
        {
          address: this.address + 2,
          value: 127,
        },
      ]);
    }

    return steps;
  }

  animationEight(numSteps: number): ChannelAnimation {
    const panMin = this.config.minPan ?? 127;
    const panMax = this.config.maxPan ?? 212;
    const tiltMin = this.config.minTilt ?? 25;
    const tiltMax = this.config.maxTilt ?? 127;

    const panStepValue = (panMax - panMin) / (numSteps / 2);
    const tiltStepValue = (tiltMax - tiltMin) / (numSteps / 2);

    const steps: ChannelAnimation = [];

    for (let i = 0; i < numSteps / 2; i++) {
      steps.push([
        {
          address: this.address + 0,
          value: panMin + i * panStepValue,
        },
        {
          address: this.address + 2,
          value: tiltMin + i * tiltStepValue,
        },
      ]);
    }

    for (let i = 0; i < numSteps / 2; i++) {
      steps.push([
        {
          address: this.address + 0,
          value: panMax - i * panStepValue,
        },
        {
          address: this.address + 2,
          value: tiltMax - i * tiltStepValue,
        },
      ]);
    }

    return steps;
  }

  animationNodding(numSteps: number): ChannelAnimation {
    const panMin = this.config.minPan ?? 127;
    const panMax = this.config.maxPan ?? 212;
    const tiltMin = this.config.minTilt ?? 25;
    const tiltMax = this.config.maxTilt ?? 127;

    const panStepValue = (panMax - panMin) / (numSteps / 2);
    const tiltStepValue = (tiltMax - tiltMin) / (numSteps / 8);

    const panSteps: ChannelAnimation = [];
    const tiltSteps: ChannelAnimation = [];

    for (let i = 0; i < numSteps / 2; i++) {
      panSteps.push([
        {
          address: this.address + 0,
          value: panMin + i * panStepValue,
        },
      ]);
    }

    for (let i = 0; i < numSteps / 2; i++) {
      panSteps.push([
        {
          address: this.address + 0,
          value: panMax - i * panStepValue,
        },
      ]);
    }

    for (let i = 0; i < 4; i++) {
      for (let i2 = 0; i2 < numSteps / 8; i2++) {
        tiltSteps.push([
          {
            address: this.address + 2,
            value: panMin + i * tiltStepValue,
          },
        ]);
      }
      for (let i2 = 0; i2 < numSteps / 8; i2++) {
        tiltSteps.push([
          {
            address: this.address + 2,
            value: panMax - i2 * tiltStepValue,
          },
        ]);
      }
    }

    return mergeDevicePatterns(panSteps, tiltSteps);
  }
}
