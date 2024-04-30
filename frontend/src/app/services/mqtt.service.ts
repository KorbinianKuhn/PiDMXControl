import { Injectable } from '@angular/core';
import mqtt from 'mqtt';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  public neopixel$ = new Subject<Buffer>();

  constructor() {}

  async connect() {
    const client = await mqtt.connectAsync(environment.mqttWsUrl);

    client.on('message', (topic, message) => {
      this.neopixel$.next(message);
    });

    client.subscribe(
      'neopixel',
      {
        qos: 0,
      },
      (err) => {}
    );
  }
}
