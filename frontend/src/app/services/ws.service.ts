import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  constructor() {
    this.createSocket();
  }

  private createSocket() {
    const [scheme, basename] = environment.baseRestApi.split('://');
    const protocol = scheme === 'https' ? 'wss' : 'ws';
    const [hostname, ...elements] = basename.split('/');

    const path = `/${[...elements].join('/')}/`;
    const url = `${protocol}://${hostname}`;

    this.socket = io('ws://localhost:3000', {
      autoConnect: false,
      // path,
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
