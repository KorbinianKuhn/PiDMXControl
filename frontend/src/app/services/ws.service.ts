import { inject, Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { EnvService } from './env.service';
import {
  ActiveProgramName,
  ChaseColor,
  ClientToServerEvents,
  DeviceConfig,
  OverrideProgramName,
  ServerStatus,
  ServerToClientEvents,
  Visuals,
} from './ws.interfaces';

interface ClientStatus extends ServerStatus {
  connected: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WSService {
  private envService = inject(EnvService);

  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>;

  public readonly status = signal<ServerStatus>({
    value: 'init',
  });
  public readonly connected = signal(false);

  public readonly bpm = signal<number>(128);
  public readonly tick = signal<number>(0);
  public readonly black = signal<boolean>(false);
  public readonly strobe = signal<boolean>(false);
  public readonly master = signal<number>(100);
  public readonly ambientUV = signal<number>(0);
  public readonly activeProgramName = signal<ActiveProgramName>(
    ActiveProgramName.ON,
  );
  public readonly currentActiveProgram = signal<{
    programName: string;
    color: string;
    progress: number;
  }>({ programName: '', color: '', progress: 0 });
  public readonly activeColors = signal<ChaseColor[]>([]);
  public readonly overrideProgramName = signal<OverrideProgramName | null>(
    null,
  );
  public readonly currentOverrideProgram = signal<{
    programName: string;
    color: string;
    progress: number;
  }>({ programName: '', color: '', progress: 0 });
  public readonly settingsMode = signal<boolean>(false);
  public readonly settingsData = signal<number[]>([]);

  public readonly devices = signal<DeviceConfig[]>([]);

  public readonly visualsSource = signal<number>(-1);
  public readonly visualsSettings = signal<Visuals>({
    sources: [],
    currentIndex: -1,
    startedAt: '',
    color: 'chase',
    opacity: 'chase',
    text: false,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  private getWsUrl(): {
    url: string;
    path: string;
  } {
    const url = this.envService.baseRestApi.replace('http://', '');

    const [hostname, ...paths] = url.split('/');
    const path = '/' + [...paths, 'socket.io'].join('/');

    return {
      url: `ws://${hostname}`,
      path,
    };
  }

  constructor() {
    this.createSocket();
  }

  private createSocket() {
    const { url, path } = this.getWsUrl();

    this.socket = io(url, {
      autoConnect: false,
      path,
    });

    this.registerEvents();
  }

  connect() {
    const { url } = this.getWsUrl();
    console.log(`ws connect: ${url}`);
    this.socket.connect();
  }

  registerEvents() {
    this.socket.on('connect', () => {
      console.log('ws connected');
      this.connected.set(true);
    });
    this.socket.on('disconnect', () => {
      console.log('ws disconnected');
      this.connected.set(false);
    });
    this.socket.on('status', (status) => {
      this.status.set(status);
    });

    this.socket.on('bpm:updated', (data) => {
      this.bpm.set(data.value);
    });

    this.socket.on('tick:updated', (data) => {
      this.tick.set(data.value);
    });

    this.socket.on('black:updated', (data) => {
      this.black.set(data.value);
    });

    this.socket.on('master:updated', (data) => {
      this.master.set(data.value);
    });

    this.socket.on('ambient-uv:updated', (data) => {
      this.ambientUV.set(data.value);
    });

    this.socket.on('override-program:updated', (data) => {
      this.overrideProgramName.set(data.value);
    });

    this.socket.on('override-program:progress', (data) => {
      this.currentOverrideProgram.set(data);
    });

    this.socket.on('active-program:updated', (data) => {
      this.activeProgramName.set(data.value);
    });

    this.socket.on('active-program:progress', (data) => {
      this.currentActiveProgram.set(data);
    });

    this.socket.on('active-colors:updated', (data) => {
      this.activeColors.set(data.colors);
    });

    this.socket.on('settings-mode:updated', (data) => {
      this.settingsMode.set(data.value);
    });

    this.socket.on('settings-data:updated', (data) => {
      this.settingsData.set(data.buffer);
    });

    this.socket.on('device-config:updated', (data) => {
      this.devices.set(data.devices);
    });
    this.socket.on('visuals:source-updated', (data) => {
      this.visualsSource.set(data);
    });
    this.socket.on('visuals:settings-updated', (data) => {
      this.visualsSettings.set(data);
    });
  }

  setBpm(value: number) {
    this.socket.emit('set:bpm', { value });
  }

  setStart() {
    this.socket.emit('set:start');
  }

  setBlack(value: boolean) {
    this.socket.emit('set:black', { value });
  }

  setAmbientUV(value: number) {
    this.socket.emit('set:ambient-uv', { value });
  }

  setMaster(value: number) {
    this.socket.emit('set:master', { value });
  }

  setOverrideProgramName(value: OverrideProgramName | null) {
    this.socket.emit('set:override-program', { value });
  }

  setActiveProgramName(value: ActiveProgramName) {
    this.socket.emit('set:active-program', { value });
  }

  setColors(colors: ChaseColor[]) {
    this.socket.emit('set:active-colors', { colors });
  }

  setSettingsMode(value: boolean) {
    this.socket.emit('set:settings-mode', { value });
  }

  setSettingsChannel(address: number, value: number) {
    this.socket.emit('set:settings-channel', { address, value });
  }

  setDeviceConfig(id: string, config: DeviceConfig) {
    this.socket.emit('set:device-config', { id, config });
  }

  setVisualsSource(id: number) {
    this.socket.emit('set:visuals-source', { id });
  }

  setVisualsSettings(settings: {
    color: 'chase' | 'original';
    opacity: 'chase' | 'off';
    text: boolean;
    left: number;
    right: number;
    top: number;
    bottom: number;
  }) {
    this.socket.emit('set:visuals-settings', settings);
  }
}
