import mqtt from 'mqtt';

export class MQTT {
  private client: mqtt.MqttClient;

  async init() {
    try {
      this.client = await mqtt.connectAsync(process.env.CONFIG === 'pi' ? 'mqtt://mosquitto:1883' : 'mqtt://localhost:1883', {
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
}
