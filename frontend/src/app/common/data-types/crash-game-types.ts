export interface CanvasDrawableNumber {
  number: number;
  x: number;
  y: number;
  initX: number;
  initY: number;
  speed: number;
}

export enum CrashStates {
  RUNNING = 'RUNNING',
  WAITING = 'WAITING',
  CRASHED = 'CRASHED',
}
