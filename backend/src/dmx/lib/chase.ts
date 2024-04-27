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
  RED_WHITE = 'red-white',
}

export type ChannelAnimation = Array<ChannelState[]>;

export class Chase {
  private steps: Array<Buffer> = [];
  private pixelSteps: Array<Buffer> = [];

  get length(): number {
    return this.steps.length;
  }

  get lengthPixel(): number {
    return this.pixelSteps.length;
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
        OverrideProgramName.BUILDUP_BRIGHT,
        OverrideProgramName.BUILDUP_FADEOUT,
        OverrideProgramName.BUILDUP_BLINDER,
        OverrideProgramName.STROBE_A,
        OverrideProgramName.STROBE_B,
        OverrideProgramName.STROBE_C,
        OverrideProgramName.STROBE_D,
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

  addPixelSteps(steps: Array<number[]>) {
    if (steps.length !== this.length * 4) {
      throw new Error(
        `Pixel steps length (${
          steps.length
        }) does not match chase steps length (${this.length * 4})`,
      );
    }
    this.pixelSteps = steps.map((step) => Buffer.from(step));
  }

  pixelData(stepIndex: number): Buffer {
    return this.pixelSteps[stepIndex];
  }
}
