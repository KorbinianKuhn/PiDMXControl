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
    const steps: ChannelAnimation = [];

    const panMin = this.config.minPan ?? 127;
    const panMax = this.config.maxPan ?? 212;
    const tiltMin = this.config.minTilt ?? 25;
    const tiltMax = this.config.maxTilt ?? 127;

    // PAN
    const panSteps = numSteps / 2;
    const panStepValue = (panMax - panMin) / panSteps;
    const panRight = new Array(panSteps)
      .fill(null)
      .map((o, i) => panMin + i * panStepValue);

    const animationPan = [...panRight, ...panRight.slice().reverse()];

    // TILT
    const tiltSteps = numSteps / 4;
    const tiltStepValue = (tiltMax - tiltMin) / tiltSteps;
    const tiltUp = new Array(tiltSteps)
      .fill(null)
      .map((o, i) => tiltMin + i * tiltStepValue);
    const tiltDown = tiltUp.slice().reverse();
    const animationTiltUnshifted = [
      ...tiltUp,
      ...tiltDown,
      ...tiltUp,
      ...tiltDown,
    ];
    const animationTilt = [
      ...animationTiltUnshifted.slice(tiltSteps / 2),
      ...animationTiltUnshifted.slice(0, tiltSteps / 2),
    ];

    // ANIMATION
    for (let i = 0; i < numSteps; i++) {
      steps.push([
        {
          address: this.address + 0,
          value: animationPan[i],
        },
        {
          address: this.address + 2,
          value: animationTilt[i],
        },
      ]);
    }

    return steps;
  }

  animationNodding(numSteps: number): ChannelAnimation {
    const steps: ChannelAnimation = [];

    const panMin = this.config.minPan ?? 127;
    const panMax = this.config.maxPan ?? 212;
    const tiltMin = this.config.minTilt ?? 25;
    const tiltMax = this.config.maxTilt ?? 127;

    // PAN
    const panSteps = numSteps / 2;
    const panStepValue = (panMax - panMin) / panSteps;
    const panRight = new Array(panSteps)
      .fill(null)
      .map((o, i) => panMin + i * panStepValue);

    const animationPan = [...panRight, ...panRight.slice().reverse()];

    // TILT
    const tiltSteps = numSteps / 8;
    const tiltStepValue = (tiltMax - tiltMin) / tiltSteps;
    const tiltUp = new Array(tiltSteps)
      .fill(null)
      .map((o, i) => tiltMin + i * tiltStepValue);
    const tiltDown = tiltUp.slice().reverse();
    const animationTiltUnshifted = [
      ...tiltUp,
      ...tiltDown,
      ...tiltUp,
      ...tiltDown,
    ];
    const animationTilt = [
      ...animationTiltUnshifted.slice(tiltSteps / 2),
      ...animationTiltUnshifted.slice(0, tiltSteps / 2),
    ];

    // ANIMATION
    for (let i = 0; i < numSteps; i++) {
      steps.push([
        {
          address: this.address + 0,
          value: animationPan[i],
        },
        {
          address: this.address + 2,
          value: animationTilt[i],
        },
      ]);
    }

    return steps;
  }
}
