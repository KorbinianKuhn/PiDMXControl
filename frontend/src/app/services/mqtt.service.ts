import { Injectable } from '@angular/core';
import mqtt from 'mqtt';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  public messages$ = new Subject<{ deviceId: string; message: Buffer }>();

  constructor() {}

  async connect() {
    const client = await mqtt.connectAsync(environment.mqttWsUrl);

    client.on('message', (topic, message) => {
      this.messages$.next({ deviceId: topic, message });
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
