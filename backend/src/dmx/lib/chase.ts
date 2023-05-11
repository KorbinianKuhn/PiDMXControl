import { ChannelState } from './device';
import { ActiveProgramName, OverrideProgramName } from './program';

export enum ChaseColor {
  UV_PINK = 'uv-pink',
  BLUE_CYAN = 'blue-cyan',
  RED_AMBER = 'red-amber',
  GREEN_CYAN = 'green-cyan',
  PINK_TEAL = 'pink-teal',
  RED_PINK = 'red-pink',
  BLUE_TEAL = 'blue-teal',
  GREEN_PINK = 'green-pink',
  RED_TEAL = 'red-teal',
  BLUE_PINK = 'blue-pink',
  UV_RED = 'uv-red',
  TEAL_CYAN = 'teal-cyan',
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

  public loop = true;

  constructor(
    public programName: ActiveProgramName | OverrideProgramName,
    public color: ChaseColor,
  ) {
    if (
      [
        OverrideProgramName.BUILDUP_4,
        OverrideProgramName.BUILDUP_8,
        OverrideProgramName.BUILDUP_16,
        OverrideProgramName.SHORT_STROBE,
      ].includes(programName as any)
    ) {
      this.loop = false;
    }
  }

  addStep(channels: ChannelState[]) {
    const data = Buffer.alloc(512 + 1, 0);
    for (const channel of channels) {
      data[channel.address] = Math.round(channel.value);
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
