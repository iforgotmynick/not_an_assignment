import { rgb } from 'd3-color';

export const lightenColor = (input: string, percent: number): string => {
  const c = rgb(input);
  if (!c) return '#ccc';

  c.r = Math.min(255, Math.floor(c.r * (1 + percent / 100)));
  c.g = Math.min(255, Math.floor(c.g * (1 + percent / 100)));
  c.b = Math.min(255, Math.floor(c.b * (1 + percent / 100)));

  return c.formatHex();
};
