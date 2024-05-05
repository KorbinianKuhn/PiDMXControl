import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import {
  ActiveProgramName,
  ChaseColor,
  ClientToServerEvents,
  DeviceConfig,
  OverrideProgramName,
  ServerToClientEvents,
  Visuals,
} from './ws.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WSService {
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>;

  public bpm$ = new BehaviorSubject<number>(128);
  public tick$ = new BehaviorSubject<number>(0);
  public black$ = new BehaviorSubject<boolean>(false);
  public strobe$ = new BehaviorSubject<boolean>(false);
  public master$ = new BehaviorSubject<number>(100);
  public ambientUV$ = new BehaviorSubject<number>(0);
  public activeProgramName$ = new BehaviorSubject<ActiveProgramName>(
    ActiveProgramName.ON
  );
  public currentActiveProgram$ = new BehaviorSubject<{
    programName: string;
    color: string;
    progress: number;
  }>({ programName: '', color: '', progress: 0 });
  public activeColors$ = new BehaviorSubject<ChaseColor[]>([]);
  public overrideProgramName$ = new BehaviorSubject<OverrideProgramName | null>(
    null
  );
  public currentOverrideProgram$ = new BehaviorSubject<{
    programName: string;
    color: string;
    progress: number;
  }>({ programName: '', color: '', progress: 0 });
  public settingsMode$ = new BehaviorSubject<boolean>(false);
  public settingsData$ = new BehaviorSubject<number[]>([]);

  public devices$ = new BehaviorSubject<DeviceConfig[]>([]);
  public visuals$ = new BehaviorSubject<Visuals>({
    sources: [],
    currentIndex: -1,
    startedAt: '',
  });

  constructor() {
    this.createSocket();
  }

  private createSocket() {
    const url = environment.baseRestApi.replace('http://', '');

    const [hostname, ...paths] = url.split('/');
    const path = '/' + [...paths, 'socket.io'].join('/');

    this.socket = io(`ws://${hostname}`, {
      autoConnect: false,
      path,
    });

    this.registerEvents();
  }

  connect() {
    // Connect
    this.socket.connect();
  }

  async disconnect() {
    this.socket.disconnect();
  }

  registerEvents() {
    this.socket.on('bpm:updated', (data) => {
      this.bpm$.next(data.value);
    });

    this.socket.on('tick:updated', (data) => {
      this.tick$.next(data.value);
    });

    this.socket.on('black:updated', (data) => {
      this.black$.next(data.value);
    });

    this.socket.on('master:updated', (data) => {
      this.master$.next(data.value);
    });

    this.socket.on('ambient-uv:updated', (data) => {
      this.ambientUV$.next(data.value);
    });

    this.socket.on('override-program:updated', (data) => {
      this.overrideProgramName$.next(data.value);
    });

    this.socket.on('override-program:progress', (data) => {
      this.currentOverrideProgram$.next(data);
    });

    this.socket.on('active-program:updated', (data) => {
      this.activeProgramName$.next(data.value);
    });

    this.socket.on('active-program:progress', (data) => {
      this.currentActiveProgram$.next(data);
    });

    this.socket.on('active-colors:updated', (data) => {
      this.activeColors$.next(data.colors);
    });

    this.socket.on('settings-mode:updated', (data) => {
      this.settingsMode$.next(data.value);
    });

    this.socket.on('settings-data:updated', (data) => {
      this.settingsData$.next(data.buffer);
    });

    this.socket.on('device-config:updated', (data) => {
      const devices = this.devices$.getValue().filter((o) => o.id !== data.id);
      devices.push(data.config);
      this.devices$.next(devices);
    });
    this.socket.on('visuals:updated', (data) => {
      this.visuals$.next(data);
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

  setVisualSource(id: number) {
    this.socket.emit('set:visuals', { id });
  }
}
