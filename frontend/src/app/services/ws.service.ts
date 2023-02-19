import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { ClientToServerEvents, ServerToClientEvents } from './ws.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WSService {
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>;

  public bpm$ = new BehaviorSubject<number>(128);
  public black$ = new BehaviorSubject<boolean>(false);
  public master$ = new BehaviorSubject<number>(100);
  public dmx$ = new Subject<number[]>();

  constructor() {
    this.createSocket();
  }

  private createSocket() {
    const url = environment.baseRestApi.replace('http://', '');

    const [hostname, ...paths] = url.split('/');
    const path = '/' + [...paths, 'socket.io'].join('/');

    console.log(path);

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

    this.socket.on('black:updated', (data) => {
      this.black$.next(data.value);
    });

    this.socket.on('master:updated', (data) => {
      this.master$.next(data.value);
    });

    this.socket.on('chase:updated', (data) => {
      // console.log(data.value);
    });

    this.socket.on('step:updated', (data) => {
      // console.log(data.value);
    });

    this.socket.on('dmx:write', (data) => {
      this.dmx$.next(data.data);
    });
  }

  setBpm(value: number) {
    console.log('update bpm');
    this.socket.emit('set:bpm', { value });
  }

  setBlack(value: boolean) {
    console.log('set black');
    this.socket.emit('set:black', { value });
  }

  setMaster(value: number) {
    console.log('set master');
    this.socket.emit('set:master', { value });
  }
}
