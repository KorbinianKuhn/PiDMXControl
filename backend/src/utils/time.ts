export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));

export const bpmToMs = (bpm: number) => 60000 / bpm;
