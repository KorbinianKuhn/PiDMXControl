export enum ChaseColor {
  UV_PINK = 'uv-pink',
  BLUE_CYAN = 'blue-cyan',
  RED_AMBER = 'red-amber',
  GREEN_CYAN = 'green-cyan',
  RED_WHITE = 'red-white',
}

export enum OverrideProgramName {
  BUILDUP_4 = 'buildup-4',
  BUILDUP_8 = 'buildup-8',
  BUILDUP_16 = 'buildup-16',
  STROBE = 'strobe',
}

export enum ActiveProgramName {
  ON = 'on',
  FADE = 'fade',
  MOODY = 'moody',
  CLUB = 'club',
}

export interface ClientToServerEvents {
  'set:bpm': (payload: { value: number }) => void;
  'set:start': () => void;
  'set:black': (payload: { value: boolean }) => void;
  'set:master': (payload: { value: number }) => void;
  'set:ambient-uv': (payload: { value: number }) => void;
  'set:override-program': (payload: { value: OverrideProgramName }) => void;
  'set:active-program': (payload: { value: ActiveProgramName }) => void;
  'set:active-colors': (payload: { colors: ChaseColor[] }) => void;
}

export interface ServerToClientEvents {
  'black:updated': (payload: { value: boolean }) => void;
  'bpm:updated': (payload: { value: number }) => void;
  'tick:updated': (payload: { value: number }) => void;
  'master:updated': (payload: { value: number }) => void;
  'ambient-uv:updated': (payload: { value: number }) => void;
  'override-program:updated': (payload: { value: OverrideProgramName }) => void;
  'active-program:updated': (payload: { value: ActiveProgramName }) => void;
  'active-colors:updated': (payload: { colors: ChaseColor[] }) => void;
  // 'chase:updated': (payload: { value: number }) => void;
  // 'step:updated': (payload: { value: number }) => void;
  'dmx:write': (payload: { data: number[] }) => void;
}
