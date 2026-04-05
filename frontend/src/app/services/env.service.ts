import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

type WindowWithEnv = Window & {
  env: {
    BASE_REST_API: string;
    MQTT_WS_URL: string;
  };
};

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  private window = window as unknown as WindowWithEnv;

  get baseRestApi(): string {
    return environment.baseRestApi ?? this.window.env.BASE_REST_API;
  }

  get mqttWsUrl(): string {
    return environment.mqttWsUrl ?? this.window.env.MQTT_WS_URL;
  }
}
