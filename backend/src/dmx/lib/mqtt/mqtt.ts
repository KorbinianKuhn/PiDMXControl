import mqtt from 'mqtt';
import { MQTT_HOST } from '../env';

export class MQTT {
  private client: mqtt.MqttClient;

  async init() {
    try {
      this.client = await mqtt.connectAsync(MQTT_HOST, {
        queueQoSZero: false,
      });
    } catch (err) {
      console.error(err);
    }
  }

  send(topic: string, message: Buffer) {
    this.client?.publish(topic, message, {
      qos: 0,
      retain: false,
    });
  }

  subscribe(callback: (topic: string, message: Buffer) => void) {
    this.client?.on('message', callback);
    this.client?.subscribe('+', { qos: 0 });
  }
}
