export enum ChaseColor {
  VIOLET_PINK = 'violet-pink',
  BLUE_EMERALD = 'blue-emerald',
  GREEN_PINK = 'green-pink',
  RED_TEAL = 'red-teal',
  EMERALD_FUCHSIA = 'emerald-fuchsia',
  TEAL_PINK = 'teal-pink',
  BLUE_FUCHSIA = 'blue-fuchsia',
  ORANGE_CYAN = 'orange-cyan',
  LIME_PINK = 'lime-pink',
  RED_AMBER = 'red-amber',
  CYAN_PINK = 'cyan-pink',
  GREEN_CYAN = 'green-cyan',
  RED_FUCHSIA = 'red-fuchsia',
  CYAN_GREEN = 'cyan-green',
  ORANGE_EMERALD = 'orange-emerald',
  CYAN_BLUE = 'cyan-blue',
  GREEN_INDIGO = 'green-indigo',
  RED_VIOLET = 'red-violet',
  LIME_BLUE = 'lime-blue',
  BLUE_PINK = 'blue-pink',
  CYAN_VIOLET = 'cyan-violet',
  BLUE_TEAL = 'blue-teal',
  ORANGE_INDIGO = 'orange-indigo',
  YELLOW_PINK = 'yellow-pink',
}

export enum OverrideProgramName {
  DAY = 'day',
  NIGHT = 'night',
  FADE = 'fade',
  WHITE = 'white',
  WARM = 'warm',
  BUILDUP_BRIGHT = 'buildup-bright',
  BUILDUP_FADEOUT = 'buildup-fadeout',
  BUILDUP_BEAM = 'buildup-beam',
  BUILDUP_BLINDER = 'buildup-blinder',
  BUILDUP_STREAK = 'buildup-streak',
  BUILDUP_BLINK = 'buildup-blink',
  STROBE_FLASH = 'strobe-flash',
  STROBE_SLOWMO = 'strobe-slowmo',
  STROBE_COLOR = 'strobe-color',
  STROBE_WHITE = 'strobe-white',
  STROBE_PIXELS = 'strobe-pixels',
  STROBE_DISCO = 'strobe-disco',
  STROBE_STORM = 'strobe-storm',
}

export enum ActiveProgramName {
  ON = 'on',
  PRIDE = 'pride',
  MIRROR_BALL = 'mirror-ball',
  MAGIC = 'magic',
  MOODY = 'moody',
  CLUB = 'club',
  ROUGH = 'rough',
  PULSE = 'pulse',
  DARK = 'dark',
  LATE = 'late',
  WILD = 'wild',
}

export interface DeviceConfig {
  id: string;
  master: number;
  minPan?: number;
  maxPan?: number;
  minTilt?: number;
  maxTilt?: number;
  disabled?: boolean;
}

export interface Visuals {
  sources: Array<{ url: string }>;
  currentIndex: number;
  startedAt: string;
  color: 'chase' | 'original';
  opacity: 'chase' | 'off';
  text: boolean;
  left: number;
  right: number;
  top: number;
  bottom: number;
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
  'set:visuals-source': (payload: { id: number }) => void;
  'set:visuals-settings': (payload: {
    color: 'chase' | 'original';
    opacity: 'chase' | 'off';
    text: boolean;
    left: number;
    right: number;
    top: number;
    bottom: number;
  }) => void;
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
  'settings-mode:updated': (payload: { value: boolean }) => void;
  'settings-data:updated': (payload: { buffer: number[] }) => void;
  'device-config:updated': (payload: {
    id: string;
    config: DeviceConfig;
  }) => void;
  'visuals:source-updated': (payload: number) => void;
  'visuals:settings-updated': (payload: Visuals) => void;
}
