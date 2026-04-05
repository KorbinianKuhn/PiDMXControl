import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  baseRestApi: null, // -> set by env substitution
  mqttWsUrl: null, // -> set by env substitution
};
