import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  baseRestApi: import.meta.env.BASE_REST_API || 'http://localhost:3000',
  mqttWsUrl: import.meta.env.MQTT_WS_URL || 'ws://localhost:8883',
};
