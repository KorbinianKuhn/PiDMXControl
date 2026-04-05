import cors from 'cors';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { DMX } from './dmx/dmx';
import { STATIC_DIRECTORY } from './env';
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

  io.on('connection', (socket) => {
    const sendInitialValues = () => {
      socket.emit('bpm:updated', { value: dmx.config.bpm });
      socket.emit('black:updated', { value: dmx.config.black });
      socket.emit('master:updated', { value: dmx.config.master });
      socket.emit('ambient-uv:updated', { value: dmx.config.ambientUV });
      socket.emit('override-program:updated', {
        value: dmx.config.overrideProgram,
      });
      socket.emit('active-program:updated', {
        value: dmx.config.activeProgram,
      });
      socket.emit('active-colors:updated', {
        colors: dmx.config.activeColors,
      });
      socket.emit('settings-mode:updated', {
        value: dmx.config.settingsMode,
      });
      socket.emit('settings-data:updated', {
        buffer: [...dmx.config.settingsData],
      });
      for (const device of dmx.config.devices) {
        socket.emit('device-config:updated', {
          id: device.id,
          config: dmx.config.getDeviceConfig(device.id),
        });
      }
      socket.emit('visuals:source-updated', dmx.config.visuals.currentIndex);
      socket.emit('visuals:settings-updated', dmx.config.visuals);
    };

    socket.emit('status', dmx.status$.getValue());

    if (dmx.isReady) {
      sendInitialValues();
    }

    const subscription = dmx.status$.subscribe((status) => {
      socket.emit('status', status);

      if (dmx.isReady) {
        sendInitialValues();
      }
    });

    socket.on('disconnect', () => {
      subscription.unsubscribe();
    });

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
