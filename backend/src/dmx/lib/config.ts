import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { BehaviorSubject, debounceTime, skip, Subject } from 'rxjs';
import { TypedServer } from '../../server/events.interfaces';
import { Logger } from '../../utils/logger';
import { ChaseColor } from './chase';
import { ActiveProgramName, OverrideProgramName } from './program';

const CONFIG_PATH = join(__dirname, '../../..', 'static/config.json');

interface ConfigStore {
  bpm: number;
  black: boolean;
  master: number;
  ambientUV: number;
  overrideProgram: OverrideProgramName;
  activeProgram: ActiveProgramName;
  activeColors: ChaseColor[];
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

  private store$ = new Subject<void>();
  private logger = new Logger('config');

  constructor(private io: TypedServer) {
    this._readConfigFromFile();
    this.store$
      .pipe(debounceTime(5000), skip(1))
      .subscribe(() => this._saveToFile());
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
}
