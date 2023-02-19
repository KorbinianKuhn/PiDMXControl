import { ChannelSetting } from '../_legacy/device';

export class Chase {
  private steps: Array<ChannelSetting[]> = [];
  private currentIndex = 0;

  next(): number {
    if (this.currentIndex === this.steps.length - 1) {
      this.currentIndex = -1;
      return this.currentIndex;
    }
    this.currentIndex++;
    return this.currentIndex;
  }

  getState() {
    return this.steps[this.currentIndex];
  }

  addStep(...snapshots: Array<ChannelSetting[]>) {
    const flat: ChannelSetting[] = [];
    for (const snapshot of snapshots) {
      flat.push(...snapshot);
    }
    this.steps.push(flat);
  }
}
