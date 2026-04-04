export let UART_SERIAL: boolean = false;
export let MQTT_HOST: string = 'mqtt://localhost:1883';
export let SEND_DATA: boolean = true;

switch (process.env.CONFIG) {
  case 'pi':
    UART_SERIAL = true;
    MQTT_HOST = 'mqtt://mosquitto:1883';
    break;
  case 'receiver':
    UART_SERIAL = true;
    MQTT_HOST = 'mqtt://mosquitto:1883';
    SEND_DATA = false;
    break;
  case 'sender':
    MQTT_HOST = 'mqtt://dmx:1883';
    break;
  default:
    break;
}
