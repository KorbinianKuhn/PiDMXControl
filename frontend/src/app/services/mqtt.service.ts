import { inject, Injectable, signal } from '@angular/core';
import mqtt from 'mqtt';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private envService = inject(EnvService);

  public readonly dmx = signal<number[]>([]);
  public readonly visualisation = signal<number[]>([]);
  public readonly neopixelA = signal<number[]>([]);
  public readonly neopixelB = signal<number[]>([]);

  public readonly connected = signal(false);

  connect() {
    console.log(`mqtt connect: ${this.envService.mqttWsUrl}`);
    const client = mqtt.connect(this.envService.mqttWsUrl);

    client.on('connect', () => {
      this.connected.set(true);
      console.log(`mqtt connected`);
    });

    client.on('disconnect', () => {
      this.connected.set(false);
      console.log(`mqtt disconnected`);
    });

    client.on('error', (err) => {
      console.log(`mqtt error`, err);
    });

    client.on('message', (topic, message) => {
      switch (topic) {
        case 'visualisation':
          this.visualisation.set(Array.from(message));
          break;
        case 'dmx':
          this.dmx.set(Array.from(message));
          break;
        case 'visualisation-neopixel-a':
          this.neopixelA.set(Array.from(message));
          break;
        case 'visualisation-neopixel-b':
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
