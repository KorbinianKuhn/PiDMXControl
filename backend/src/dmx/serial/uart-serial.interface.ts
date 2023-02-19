export abstract class Serial {
  abstract init(): Promise<void>;
  abstract write(data: Buffer): Promise<void>;
}
