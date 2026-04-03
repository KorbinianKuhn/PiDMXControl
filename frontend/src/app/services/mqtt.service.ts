import { Injectable, signal } from '@angular/core';
import mqtt from 'mqtt';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  public dmx = signal<number[]>([]);
  public neopixelA = signal<number[]>([]);
  public neopixelB = signal<number[]>([]);

  async connect() {
    const client = await mqtt.connectAsync(environment.mqttWsUrl);

    client.on('message', (topic, message) => {
      switch (topic) {
        case 'dmx':
          this.dmx.set(Array.from(message));
          break;
        case 'neopixel-a':
          this.neopixelA.set(Array.from(message));
          break;
        case 'neopixel-b':
          this.neopixelB.set(Array.from(message));
          break;
      }
    });

    client.subscribe(
      '+',
      {
        qos: 0,
      },
      (err) => {},
    );
  }
}
