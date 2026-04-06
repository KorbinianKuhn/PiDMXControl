import { inject, Injectable, signal } from '@angular/core';
import mqtt, { MqttClient } from 'mqtt';
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

  private client!: MqttClient;

  connect() {
    console.log(`mqtt connect: ${this.envService.mqttWsUrl}`);
    this.client = mqtt.connect(this.envService.mqttWsUrl);

    this.client.on('connect', () => {
      this.connected.set(true);
      console.log(`mqtt connected`);
    });

    this.client.on('disconnect', () => {
      this.connected.set(false);
      console.log(`mqtt disconnected`);
    });

    this.client.on('error', (err) => {
      console.log(`mqtt error`, err);
    });

    this.client.on('message', (topic, message) => {
      switch (topic) {
        case 'dmx':
          this.dmx.set(Array.from(message));
          break;
        case 'visualisation/dmx':
          this.visualisation.set(Array.from(message));
          break;
        case 'visualisation/neopixel-a':
          this.neopixelA.set(Array.from(message));
          break;
        case 'visualisation/neopixel-b':
          this.neopixelB.set(Array.from(message));
          break;
      }
    });
  }

  subscribe(topic: 'dmx' | 'visualisation/#') {
    console.log('subscribe', topic);
    this.client.subscribe(topic, {
      qos: 0,
    });
  }

  unsubscribe(topic: 'dmx' | 'visualisation/#') {
    console.log('unsubscribe', topic);
    this.client.unsubscribe(topic);
  }
}
