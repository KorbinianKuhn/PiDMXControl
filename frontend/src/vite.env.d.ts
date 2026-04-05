/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_REST_API: string;
  readonly MQTT_WS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
