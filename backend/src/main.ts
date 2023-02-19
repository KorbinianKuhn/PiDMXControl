import { createServer } from 'http';
import { Server } from 'socket.io';
import { DMX } from './dmx/dmx';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from './server/events.interfaces';
import { Logger } from './utils/logger';

const logger = new Logger('main');

const main = async () => {
  const httpServer = createServer((req, res) => {
    res.write('hello\n');
    res.end();
  });
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      cors: {
        origin: '*',
      },
    },
  );

  const dmx = new DMX(io);

  await dmx.init();

  io.on('connection', (socket) => {
    socket.on('set:bpm', (args) => {
      dmx.setBpm(args.value);
    });

    socket.on('set:black', (args) => {
      dmx.setBlack(args.value);
    });

    socket.on('set:strobe', (args) => {
      dmx.setStrobe(args.value);
    });

    socket.on('set:master', (args) => {
      dmx.setMaster(args.value);
    });

    socket.on('set:chase-name', (args) => {
      dmx.setChaseName(args.value);
    });

    socket.on('set:colors', (args) => {
      dmx.setColors(args.colors);
    });
  });

  logger.info(`Listen on port 3000`);
  io.listen(3000);
};

logger.info('setup');
main()
  .then(() => logger.info('started'))
  .catch((err) => logger.error(err.message, err));
