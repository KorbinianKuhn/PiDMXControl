import { existsSync, readFileSync } from 'fs';
import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { BehaviorSubject, Subject, debounceTime } from 'rxjs';
import { STATIC_DIRECTORY } from '../../env';
import { TypedServer } from '../../server/events.interfaces';
import { Logger } from '../../utils/logger';
import { ChaseColor } from './chase';
import { Device } from './device';
import { ActiveProgramName, OverrideProgramName } from './program';

const CONFIG_PATH = join(STATIC_DIRECTORY, 'config.json');
const VISUALS_PATH = join(STATIC_DIRECTORY, 'visuals');

export interface DeviceConfig {
  id: string;
  master: number;
  disabled: boolean;
  minPan?: number;
  maxPan?: number;
  minTilt?: number;
  maxTilt?: number;
  flipped?: boolean;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}
interface ConfigStore {
  bpm: number;
  black: boolean;
  master: number;
  ambientUV: number;
  activeProgram: ActiveProgramName;
  activeColors: ChaseColor[];
  devices: DeviceConfig[];
}

export interface Visuals {
  sources: Array<{ url: string }>;
  currentIndex: number;
  startedAt: string;
  color: 'chase' | 'original';
  opacity: 'chase' | 'off';
  text: boolean;
}

const DEFAULT_CONFIG: ConfigStore = {
  bpm: 128,
  black: false,
  master: 1,
  ambientUV: 0,
  activeProgram: ActiveProgramName.MIRROR_BALL,
  activeColors: Object.values(ChaseColor),
  devices: [
    ...[
      'hex-1',
      'hex-2',
      'hex-3',
      'hex-4',
      'hex-5',
      'bar',
      'dome',
      'spot',
      'neopixel-a',
      'neopixel-b',
    ].map((id) => ({ id, master: 1, disabled: false })),
    ...['head-left', 'head-right'].map((id) => ({
      id,
      master: 1,
      disabled: false,
      flipped: id === 'head-left',
      minPan: 128,
      maxPan: 212,
      minTilt: 0,
      maxTilt: 128,
    })),
    {
      id: 'beamer',
      master: 1,
      disabled: false,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  ],
};

export class Config {
  public bpm: number;
  public speed$ = new BehaviorSubject<number>(null);
  public black: boolean;
  public master: number;
  public ambientUV: number;
  public overrideProgram: OverrideProgramName;
  public activeProgram: ActiveProgramName;
  public activeColors: ChaseColor[];
  public testChannelMode = false;
  public testChannelData = Buffer.alloc(512 + 1, 0);
  public visuals: Visuals = {
    sources: [],
    currentIndex: -1,
    startedAt: new Date().toISOString(),
    color: 'chase',
    opacity: 'chase',
    text: false,
  };

  public devices$ = new BehaviorSubject<DeviceConfig[]>([]);

  private store$ = new Subject<void>();
  private logger = new Logger('config');

  constructor(private io: TypedServer) {
    this._readConfigFromFile();

    this.store$.pipe(debounceTime(5000)).subscribe(() => this._saveToFile());

    this.scanVisualSources();
  }

  async _saveToFile() {
    const config: ConfigStore = {
      bpm: this.bpm,
      black: this.black,
      master: this.master,
      ambientUV: this.ambientUV,
      activeProgram: this.activeProgram,
      activeColors: this.activeColors,
      devices: this.devices$.getValue(),
    };
    const content = JSON.stringify(config, null, 2);
    await writeFile(CONFIG_PATH, content);
    this.logger.info('Saved config to file');
  }

  _readConfigFromFile() {
    let config: ConfigStore = DEFAULT_CONFIG;

    if (existsSync(CONFIG_PATH)) {
      try {
        const content = readFileSync(CONFIG_PATH, 'utf-8');
        const savedConfig = JSON.parse(content) as ConfigStore;
        const { devices, ...values } = savedConfig;

        const allDevices = [];
        for (const device of devices) {
          const item = config.devices.find((o) => o.id === device.id);
          if (item) {
            allDevices.push({
              ...item,
              ...device,
            });
          }
        }

        for (const device of config.devices) {
          if (!allDevices.find((o) => o.id === device.id)) {
            allDevices.push(device);
          }
        }

        config = {
          ...config,
          ...values,
          devices: allDevices,
        };
      } catch (error) {
        this.logger.warn(
          'Error reading config file. Creating new default config.',
        );
      }
    }

    this.setBpm(config.bpm);
    this.setBlack(config.black);
    this.setMaster(config.master);
    this.setAmbientUV(config.ambientUV);
    this.setActiveColors(config.activeColors);
    this.setOverrideProgram(null);
    this.setActiveProgram(config.activeProgram);
    this.setActiveColors(config.activeColors);

    this.devices$.next(config.devices);

    this.speed$.next(60000 / this.bpm);
  }

  setBpm(value: number) {
    this.bpm = parseFloat(value.toFixed(1));
    this.speed$.next(60000 / this.bpm);
    this.io.emit('bpm:updated', { value: this.bpm });
    this.store$.next();
  }

  setBlack(value: boolean) {
    this.black = value;
    this.io.emit('black:updated', { value });
    this.store$.next();
  }

  setMaster(value: number) {
    this.master = value;
    this.io.emit('master:updated', { value });
    this.store$.next();
  }

  setAmbientUV(value: number) {
    this.ambientUV = value;
    this.io.emit('ambient-uv:updated', { value });
    this.store$.next();
  }

  setOverrideProgram(value: OverrideProgramName) {
    this.overrideProgram = value;
    if (value !== null && this.black) {
      this.setBlack(false);
    } else if (value === null) {
      this.io.emit('override-program:progress', {
        programName: '',
        color: '',
        progress: 0,
      });
    }
    this.io.emit('override-program:updated', { value });
    this.store$.next();
  }

  setActiveProgram(value: ActiveProgramName) {
    this.activeProgram = value;
    this.io.emit('active-program:updated', { value });
    this.store$.next();
  }

  setActiveColors(colors: ChaseColor[]) {
    this.activeColors = colors;
    this.io.emit('active-colors:updated', { colors });
    this.store$.next();
  }

  setTestChannelMode(value: boolean) {
    this.testChannelMode = value;
    this.io.emit('test-channel-mode:updated', { value });
  }

  setTestChannelValue(address: number, value: number) {
    this.testChannelData[address] = value;
    this.io.emit('test-channel-data:updated', {
      buffer: [...this.testChannelData],
    });
  }

  getDeviceConfig(id: string): DeviceConfig {
    const device = this.devices$.getValue().find((o) => o.id === id);
    if (device) {
      return device;
    }

    const defaultConfig = DEFAULT_CONFIG.devices.find((o) => o.id === id);
    if (defaultConfig) {
      return defaultConfig;
    }

    return { id, master: 1, disabled: false };
  }

  setDeviceConfig(id: string, config: DeviceConfig) {
    const devices = this.devices$.getValue();
    const index = devices.findIndex((o) => o.id === id);

    if (index === -1) {
      this.logger.warn(`setDeviceConfig failed. Cannot find device ${id}`);
      return;
    }

    const device = devices[index];
    devices[index] = {
      ...device,
      ...config,
    };

    this.devices$.next(devices);

    this.store$.next();
    this.io.emit('device-config:updated', { devices });
  }

  async scanVisualSources(): Promise<void> {
    const files = await readdir(VISUALS_PATH);
    const videos = files.filter((o) => o.endsWith('.mp4'));

    this.visuals = {
      ...this.visuals,
      sources: videos.map((o, i) => ({
        url: `${o}`,
      })),
    };

    this.setVisualsSource(0);
  }

  setVisualsSource(currentIndex: number) {
    this.visuals.currentIndex = currentIndex;
    this.io.emit('visuals:settings-updated', this.visuals);
    this.io.emit('visuals:source-updated', currentIndex);
  }

  setVisualsSettings(
    color: 'chase' | 'original',
    opacity: 'chase' | 'off',
    text: boolean,
  ) {
    this.visuals = {
      ...this.visuals,
      color,
      opacity,
      text,
    };
    this.store$.next();
    this.io.emit('visuals:settings-updated', this.visuals);
  }

  registerDevices(devices: Device[]) {
    const updatedDevices: DeviceConfig[] = [];
    for (const device of devices) {
      const item = this.devices$.getValue().find((o) => o.id === device.id);
      if (item) {
        updatedDevices.push(item);
        continue;
      }

      const defaultConfig = DEFAULT_CONFIG.devices.find(
        (o) => o.id === device.id,
      );
      if (defaultConfig) {
        updatedDevices.push(defaultConfig);
        continue;
      }

      throw new Error(`Cannot register device ${device.id}`);
    }
    this.devices$.next(updatedDevices);
    this.store$.next();
  }
}
