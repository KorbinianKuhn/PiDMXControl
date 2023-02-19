import { Server } from 'socket.io';
import { ChaseColor, ChaseName } from '../dmx/chases/chase';

export interface ClientToServerEvents {
  'set:bpm': (payload: { value: number }) => void;
  'set:black': (payload: { value: boolean }) => void;
  'set:strobe': (payload: { value: boolean }) => void;
  'set:master': (payload: { value: number }) => void;
  'set:chase-name': (payload: { value: ChaseName }) => void;
  'set:colors': (payload: { colors: ChaseColor[] }) => void;
}

export interface ServerToClientEvents {
  'bpm:updated': (payload: { value: number }) => void;
  'black:updated': (payload: { value: boolean }) => void;
  'strobe:updated': (payload: { value: boolean }) => void;
  'master:updated': (payload: { value: number }) => void;
  'chase:updated': (payload: { value: number }) => void;
  'step:updated': (payload: { value: number }) => void;
  'dmx:write': (payload: { data: number[] }) => void;
  'chase-name:updated': (payload: { value: ChaseName }) => void;
  'colors:updated': (payload: { colors: ChaseColor[] }) => void;
}

export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;
