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
    socket.emit('bpm:updated', { value: dmx.config.bpm });
    socket.emit('black:updated', { value: dmx.config.black });
    socket.emit('master:updated', { value: dmx.config.master });
    socket.emit('ambient-uv:updated', { value: dmx.config.ambientUV });
    socket.emit('override-program:updated', {
      value: dmx.config.overrideProgram,
    });
    socket.emit('active-program:updated', { value: dmx.config.activeProgram });
    socket.emit('active-colors:updated', { colors: dmx.config.activeColors });

    socket.on('set:bpm', (args) => {
      dmx.setBpm(args.value);
    });

    socket.on('set:start', () => {
      dmx.setStart();
    });

    socket.on('set:black', (args) => {
      dmx.setBlack(args.value);
    });

    socket.on('set:master', (args) => {
      dmx.setMaster(args.value);
    });

    socket.on('set:ambient-uv', (args) => {
      dmx.setAmbientUV(args.value);
    });

    socket.on('set:override-program', (args) => {
      dmx.setOverrideProgram(args.value);
    });

    socket.on('set:active-program', (args) => {
      dmx.setActiveProgram(args.value);
    });

    socket.on('set:active-colors', (args) => {
      dmx.setActiveColors(args.colors);
    });
  });

  logger.info(`Listen on port 3000`);
  io.listen(3000);
};

logger.info('setup');
main()
  .then(() => logger.info('started'))
  .catch((err) => logger.error(err.message, err));
