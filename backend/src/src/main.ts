import { VarytecGigabarHex3 } from '../dmx/devices/VarytecGigaBarHex';
import { Logger } from '../utils/logger';
import { Chase } from './chase';
import { Runtime } from './runtime';
import { Universe } from './universe';

const logger = new Logger('main');

const main = async () => {
  logger.info('start');

  const universe = new Universe();

  const spot1 = new VarytecGigabarHex3(1);
  const spot2 = new VarytecGigabarHex3(12);

  const chase1 = new Chase();
  for (let i = 0; i < 10; i++) {
    chase1.addStep(
      spot1
        .reset()
        .master(255)
        .red(i % 2 ? 255 : 0)
        .snapshot(),
      spot2
        .reset()
        .master(255)
        .red(i % 2 ? 0 : 255)
        .snapshot(),
    );
  }

  const chase2 = new Chase();
  for (let i = 0; i < 10; i++) {
    chase2.addStep(
      spot1
        .reset()
        .master(255)
        .white(i % 2 ? 255 : 0)
        .snapshot(),
      spot2
        .reset()
        .master(255)
        .white(i % 2 ? 0 : 255)
        .snapshot(),
    );
  }

  universe.setChases([chase1]);

  const runtime = new Runtime(universe);

  await runtime.init();

  process.stdin.setRawMode(true);
  process.stdin.setEncoding('utf8');
  process.stdin.resume();
  process.stdin.on('data', function (data) {
    const key = data.toString();
    switch (key) {
      case 'e':
        process.exit(0);
      case '1':
        universe.setChases([chase1]);
        break;
      case '2':
        universe.setChases([chase2]);
        break;
      case '3':
        universe.setChases([chase1, chase2]);
        break;
      case 't':
        universe.tap();
        break;
    }
  });
};

main()
  .then(() => logger.info('application is running'))
  .catch((err) => logger.error(err.message, err));
