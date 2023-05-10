import { readFileSync } from 'fs';
import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { BehaviorSubject, Subject, debounceTime, skip } from 'rxjs';
import { TypedServer } from '../../server/events.interfaces';
import { Logger } from '../../utils/logger';
import { ChaseColor } from './chase';
import { ActiveProgramName, OverrideProgramName } from './program';

const CONFIG_PATH = join(__dirname, '../../..', 'static/config.json');
const VISUALS_PATH = join(__dirname, '../../..', 'static/visuals');

export interface DeviceConfig {
  id: string;
  master: number;
  minPan?: number;
  maxPan?: number;
  minTilt?: number;
  maxTilt?: number;
}
interface ConfigStore {
  bpm: number;
  black: boolean;
  master: number;
  ambientUV: number;
  overrideProgram: OverrideProgramName;
  activeProgram: ActiveProgramName;
  activeColors: ChaseColor[];
  devices: DeviceConfig[];
}

export interface Visuals {
  sources: Array<{ url: string }>;
  currentIndex: number;
  startedAt: string;
}

export class Config {
  public bpm: number;
  public speed$ = new BehaviorSubject<number>(null);
  public black: boolean;
  public master: number;
  public ambientUV: number;
  public overrideProgram: OverrideProgramName;
  public activeProgram: ActiveProgramName;
  public activeColors: ChaseColor[];
  public settingsMode = false;
  public settingsData = Buffer.alloc(512 + 1, 0);
  public visuals: Visuals = {
    sources: [],
    currentIndex: -1,
    startedAt: new Date().toISOString(),
  };

  public devices: DeviceConfig[] = [];

  private store$ = new Subject<void>();
  private logger = new Logger('config');

  constructor(private io: TypedServer) {
    this._readConfigFromFile();
    this.store$
      .pipe(debounceTime(5000), skip(1))
      .subscribe(() => this._saveToFile());

    this.scanVisualSources();
  }

  async _saveToFile() {
    const config: ConfigStore = {
      bpm: this.bpm,
      black: this.black,
      master: this.master,
      ambientUV: this.ambientUV,
      overrideProgram: this.overrideProgram,
      activeProgram: this.activeProgram,
      activeColors: this.activeColors,
      devices: this.devices,
    };
    const content = JSON.stringify(config, null, 2);
    await writeFile(CONFIG_PATH, content);
    this.logger.info('Saved config to file');
  }

  _readConfigFromFile() {
    const content = readFileSync(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(content) as ConfigStore;

    this.bpm = config.bpm;
    this.black = config.black;
    this.master = config.master;
    this.ambientUV = config.ambientUV;
    this.overrideProgram = config.overrideProgram;
    this.activeProgram = config.activeProgram;
    this.activeColors = config.activeColors;
    this.devices = config.devices;

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

  setSettingsMode(value: boolean) {
    this.settingsMode = value;
    this.io.emit('settings-mode:updated', { value });
  }

  setSettingsChannel(address: number, value: number) {
    this.settingsData[address] = value;
    this.io.emit('settings-data:updated', { buffer: [...this.settingsData] });
  }

  getDeviceConfig(id: string): DeviceConfig {
    const device = this.devices.find((o) => o.id === id);
    if (device) {
      return device;
    }

    this.devices.push({ id, master: 1 });
    return this.devices[this.devices.length - 1];
  }

  setDeviceConfig(id: string, config: DeviceConfig) {
    const device = this.getDeviceConfig(id);
    Object.assign(device, config);

    this.store$.next();
    this.io.emit('device-config:updated', { id, config });
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

    this.setVisualSource(0);
  }

  setVisualSource(currentIndex: number) {
    this.visuals = {
      ...this.visuals,
      currentIndex,
      startedAt: new Date().toISOString(),
    };
    this.io.emit('visuals:updated', this.visuals);
  }
}
