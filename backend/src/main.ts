import cors from 'cors';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { DMX } from './dmx/dmx';
import { STATIC_DIRECTORY } from './env';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  TypedServer,
  TypedSocket,
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

  app.use('/static', express.static(STATIC_DIRECTORY));

  app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send();
  });

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

  // TODO: can lead to errors in the app
  const sendInitialConfig = (emitter: TypedServer | TypedSocket) => {
    emitter.emit('bpm:updated', { value: dmx.config.bpm });
    emitter.emit('black:updated', { value: dmx.config.black });
    emitter.emit('master:updated', { value: dmx.config.master });
    emitter.emit('ambient-uv:updated', { value: dmx.config.ambientUV });
    emitter.emit('override-program:updated', {
      value: dmx.config.overrideProgram,
    });
    emitter.emit('active-program:updated', {
      value: dmx.config.activeProgram,
    });
    emitter.emit('active-colors:updated', {
      colors: dmx.config.activeColors,
    });
    emitter.emit('settings-mode:updated', {
      value: dmx.config.settingsMode,
    });
    emitter.emit('settings-data:updated', {
      buffer: [...dmx.config.settingsData],
    });
    emitter.emit('device-config:updated', {
      devices: dmx.config.devices,
    });
    emitter.emit('visuals:source-updated', dmx.config.visuals.currentIndex);
    emitter.emit('visuals:settings-updated', dmx.config.visuals);
  };

  dmx.status$.subscribe((status) => {
    io.emit('status', status);
    if (dmx.isReady) {
      sendInitialConfig(io);
    }
  });

  io.on('connection', (socket) => {
    socket.emit('status', dmx.status$.getValue());

    if (dmx.isReady) {
      sendInitialConfig(socket);
    }

    socket.on('set:bpm', (args) => {
      if (dmx.isReady) {
        dmx.config.setBpm(args.value);
      }
    });

    socket.on('set:start', () => {
      if (dmx.isReady) {
        dmx.setStart();
      }
    });

    socket.on('set:black', (args) => {
      if (dmx.isReady) {
        dmx.config.setBlack(args.value);
      }
    });

    socket.on('set:master', (args) => {
      if (dmx.isReady) {
        dmx.config.setMaster(args.value);
      }
    });

    socket.on('set:ambient-uv', (args) => {
      if (dmx.isReady) {
        dmx.config.setAmbientUV(args.value);
      }
    });

    socket.on('set:override-program', (args) => {
      if (dmx.isReady) {
        dmx.setOverrideProgram(args.value);
      }
    });

    socket.on('set:active-program', (args) => {
      if (dmx.isReady) {
        dmx.setActiveProgram(args.value);
      }
    });

    socket.on('set:active-colors', (args) => {
      if (dmx.isReady) {
        dmx.setActiveColors(args.colors);
      }
    });

    socket.on('set:settings-mode', (args) => {
      if (dmx.isReady) {
        dmx.config.setSettingsMode(args.value);
      }
    });

    socket.on('set:settings-channel', (args) => {
      if (dmx.isReady) {
        dmx.config.setSettingsChannel(args.address, args.value);
      }
    });

    socket.on('set:device-config', (args) => {
      if (dmx.isReady) {
        dmx.config.setDeviceConfig(args.id, args.config);
      }
    });

    socket.on('set:visuals-source', (args) => {
      if (dmx.isReady) {
        dmx.config.setVisualsSource(args.id);
      }
    });
    socket.on('set:visuals-settings', (args) => {
      if (dmx.isReady) {
        dmx.config.setVisualsSettings(
          args.color,
          args.opacity,
          args.text,
          args.left,
          args.right,
          args.top,
          args.bottom,
        );
      }
    });
  });

  httpServer.listen(PORT, () => {
    logger.info(`Listen on port ${PORT}`);
  });

  await dmx.init();
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
  .then(() => logger.info('ready'))
  .catch((err) => logger.error(err.message, err));
