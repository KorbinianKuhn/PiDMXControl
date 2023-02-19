import { Logger } from '../../utils/logger';
import { wait } from '../../utils/time';
import { Serial } from './serial.interface';

export class DummySerial extends Serial {
  private logger = new Logger('dummy-serial');

  async init(): Promise<void> {
    this.logger.info('init');
  }

  async write(data: Buffer) {
    await wait(2);
    this.logger.info('write', data);
  }
}
