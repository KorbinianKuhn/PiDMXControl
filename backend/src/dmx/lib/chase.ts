import { ChannelState } from './device';
import { ActiveProgramName, OverrideProgramName } from './program';

const COLORS = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
];

export enum ChaseColor {
  VIOLET_PINK = 'violet-pink',
  BLUE_EMERALD = 'blue-emerald',
  GREEN_PINK = 'green-pink',
  RED_TEAL = 'red-teal',
  EMERALD_FUCHSIA = 'emerald-fuchsia',
  TEAL_PINK = 'teal-pink',
  BLUE_FUCHSIA = 'blue-fuchsia',
  ORANGE_CYAN = 'orange-cyan',
  LIME_PINK = 'lime-pink',
  RED_AMBER = 'red-amber',
  CYAN_PINK = 'cyan-pink',
  GREEN_CYAN = 'green-cyan',
  RED_FUCHSIA = 'red-fuchsia',
  CYAN_GREEN = 'cyan-green',
  ORANGE_EMERALD = 'orange-emerald',
  CYAN_BLUE = 'cyan-blue',
  GREEN_INDIGO = 'green-indigo',
  RED_VIOLET = 'red-violet',
  LIME_BLUE = 'lime-blue',
  BLUE_PINK = 'blue-pink',
  CYAN_VIOLET = 'cyan-violet',
  BLUE_TEAL = 'blue-teal',
  ORANGE_INDIGO = 'orange-indigo',
  YELLOW_PINK = 'yellow-pink',
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

  constructor(
    public programName: ActiveProgramName | OverrideProgramName,
    public loop: boolean,
    public color?: ChaseColor,
  ) {}

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
