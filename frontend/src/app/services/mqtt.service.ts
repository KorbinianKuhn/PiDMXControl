import { Injectable } from '@angular/core';
import mqtt from 'mqtt';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  public dmx$ = new Subject<number[]>();
  public neopixelA$ = new Subject<number[]>();
  public neopixelB$ = new Subject<number[]>();

  constructor() {}

  async connect() {
    const client = await mqtt.connectAsync(environment.mqttWsUrl);

    client.on('message', (topic, message) => {
      switch (topic) {
        case 'dmx':
          this.dmx$.next(Array.from(message));
          break;
        case 'neopixel-a':
          this.neopixelA$.next(Array.from(message));
          break;
        case 'neopixel-b':
          this.neopixelB$.next(Array.from(message));
          break;
      }
    });

    client.subscribe(
      '+',
      {
        qos: 0,
      },
      (err) => {}
    );
  }
}
