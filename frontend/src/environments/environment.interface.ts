export interface Environment {
  production: boolean;
  baseRestApi: string | null;
  mqttWsUrl: string | null;
}
