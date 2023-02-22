import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import {
  ActiveProgramName,
  ChaseColor,
  ClientToServerEvents,
  ServerToClientEvents,
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
  public dmx$ = new Subject<number[]>();
  public activeProgramName$ = new BehaviorSubject<ActiveProgramName>(
    ActiveProgramName.MOODY
  );
  public activeColors$ = new BehaviorSubject<ChaseColor[]>([
    ChaseColor.RED_WHITE,
  ]);

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
      // console.log(data.value);
    });

    this.socket.on('active-program:updated', (data) => {
      this.activeProgramName$.next(data.value);
    });

    this.socket.on('active-colors:updated', (data) => {
      this.activeColors$.next(data.colors);
    });

    this.socket.on('dmx:write', (data) => {
      this.dmx$.next(data.data);
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

  setActiveProgramName(value: ActiveProgramName) {
    this.socket.emit('set:active-program', { value });
  }

  setColors(colors: ChaseColor[]) {
    this.socket.emit('set:active-colors', { colors });
  }
}
