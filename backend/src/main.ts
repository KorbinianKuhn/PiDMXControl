import * as cors from 'cors';
import * as express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import { Server } from 'socket.io';
import { DMX } from './dmx/dmx';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from './server/events.interfaces';
import { Logger } from './utils/logger';

const PORT = 3000;
const logger = new Logger('main');

const main = async () => {
  const app = express();
  app.set('port', PORT);

  app.use(
    cors({
      origin: '*',
    }),
  );

  app.use('/static', express.static(join(__dirname, '..', 'static')));

  const httpServer = createServer(app);

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
    socket.emit('settings-mode:updated', { value: dmx.config.settingsMode });
    socket.emit('settings-data:updated', {
      buffer: [...dmx.config.settingsData],
    });
    for (const device of dmx.config.devices) {
      socket.emit('device-config:updated', {
        id: device.id,
        config: dmx.config.getDeviceConfig(device.id),
      });
    }
    socket.emit('visuals:updated', dmx.config.visuals);

    socket.on('set:bpm', (args) => {
      dmx.config.setBpm(args.value);
    });

    socket.on('set:start', () => {
      dmx.setStart();
    });

    socket.on('set:black', (args) => {
      dmx.config.setBlack(args.value);
    });

    socket.on('set:master', (args) => {
      dmx.config.setMaster(args.value);
    });

    socket.on('set:ambient-uv', (args) => {
      dmx.config.setAmbientUV(args.value);
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

    socket.on('set:settings-mode', (args) => {
      dmx.config.setSettingsMode(args.value);
    });

    socket.on('set:settings-channel', (args) => {
      dmx.config.setSettingsChannel(args.address, args.value);
    });

    socket.on('set:device-config', (args) => {
      dmx.config.setDeviceConfig(args.id, args.config);
    });

    socket.on('set:visuals', (args) => {
      dmx.config.setVisuals(args.id, args.color, args.opacity);
    });
  });

  httpServer.listen(PORT, () => {
    logger.info(`Listen on port ${PORT}`);
  });
};

logger.info('setup');

process.on('uncaughtException', function (error) {
  logger.error(error.message, error.stack);
  process.exit(1);
});

process.on('unhandledRejection', function (reason, p) {
  logger.error(reason as any, {});
  process.exit(1);
});

main()
  .then(() => logger.info('started'))
  .catch((err) => logger.error(err.message, err));
