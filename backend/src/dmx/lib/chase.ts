import { ChannelState } from './device';
import { ActiveProgramName, OverrideProgramName } from './program';

export enum ChaseColor {
  UV_PINK = 'uv-pink',
  BLUE_CYAN = 'blue-cyan',
  RED_AMBER = 'red-amber',
  GREEN_CYAN = 'green-cyan',
  RED_WHITE = 'red-white',
}

export type ChannelAnimation = Array<ChannelState[]>;

export class Chase {
  private steps: Array<Buffer> = [];

  get length(): number {
    return this.steps.length;
  }

  get name(): string {
    return `${this.programName}-${this.color}`;
  }

  constructor(
    public programName: ActiveProgramName | OverrideProgramName,
    public color: ChaseColor,
  ) {}

  addStep(channels: ChannelState[]) {
    const data = Buffer.alloc(512 + 1, 0);
    for (const channel of channels) {
      data[channel.address] = channel.value;
    }
    this.steps.push(data);
  }

  addSteps(steps: ChannelAnimation) {
    for (const step of steps) {
      this.addStep(step);
    }
  }

  data(stepIndex: number): Buffer {
    return this.steps[stepIndex];
  }
}
