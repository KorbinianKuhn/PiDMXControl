export enum ChaseColor {
  UV_PINK = 'uv-pink',
  BLUE_CYAN = 'blue-cyan',
  RED_AMBER = 'red-amber',
  GREEN_CYAN = 'green-cyan',
  PINK_TEAL = 'pink-teal',
  RED_PINK = 'red-pink',
  BLUE_TEAL = 'blue-teal',
  GREEN_PINK = 'green-pink',
  RED_TEAL = 'red-teal',
  BLUE_PINK = 'blue-pink',
  UV_RED = 'uv-red',
  TEAL_CYAN = 'teal-cyan',
}

export enum OverrideProgramName {
  FADE = 'fade',
  BUILDUP_INFINITE = 'buildup-inifite',
  BUILDUP_4 = 'buildup-4',
  BUILDUP_8 = 'buildup-8',
  BUILDUP_16 = 'buildup-16',
  SHORT_STROBE = 'short-strobe',
  STROBE = 'strobe',
  DISCO = 'disco',
}

export enum ActiveProgramName {
  ON = 'on',
  MIRROR_BALL = 'mirror-ball',
  MOODY = 'moody',
  CLUB = 'club',
  WILD = 'wild',
}

export interface DeviceConfig {
  id: string;
  master: number;
  minPan?: number;
  maxPan?: number;
  minTilt?: number;
  maxTilt?: number;
}

export interface Visuals {
  sources: Array<{ url: string }>;
  currentIndex: number;
  startedAt: string;
}

export interface ClientToServerEvents {
  'set:bpm': (payload: { value: number }) => void;
  'set:start': () => void;
  'set:black': (payload: { value: boolean }) => void;
  'set:master': (payload: { value: number }) => void;
  'set:ambient-uv': (payload: { value: number }) => void;
  'set:override-program': (payload: {
    value: OverrideProgramName | null;
  }) => void;
  'set:active-program': (payload: { value: ActiveProgramName }) => void;
  'set:active-colors': (payload: { colors: ChaseColor[] }) => void;
  'set:settings-mode': (payload: { value: boolean }) => void;
  'set:settings-channel': (payload: { address: number; value: number }) => void;
  'set:device-config': (payload: { id: string; config: DeviceConfig }) => void;
  'set:visuals': (payload: { id: number }) => void;
}

export interface ServerToClientEvents {
  'black:updated': (payload: { value: boolean }) => void;
  'bpm:updated': (payload: { value: number }) => void;
  'tick:updated': (payload: { value: number }) => void;
  'master:updated': (payload: { value: number }) => void;
  'ambient-uv:updated': (payload: { value: number }) => void;
  'override-program:updated': (payload: { value: OverrideProgramName }) => void;
  'override-program:progress': (payload: {
    programName: string;
    color: string;
    progress: number;
  }) => void;
  'active-program:updated': (payload: { value: ActiveProgramName }) => void;
  'active-program:progress': (payload: {
    programName: string;
    color: string;
    progress: number;
  }) => void;
  'active-colors:updated': (payload: { colors: ChaseColor[] }) => void;
  // 'chase:updated': (payload: { value: number }) => void;
  // 'step:updated': (payload: { value: number }) => void;
  'dmx:write': (payload: { buffer: number[] }) => void;
  'settings-mode:updated': (payload: { value: boolean }) => void;
  'settings-data:updated': (payload: { buffer: number[] }) => void;
  'device-config:updated': (payload: {
    id: string;
    config: DeviceConfig;
  }) => void;
  'visuals:updated': (payload: Visuals) => void;
}
