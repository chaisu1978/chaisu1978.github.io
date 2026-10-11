export interface LevelConfig {
  key: string;
  title: string;
  intro: { title: string; lines: string[] };
  /** level key of the next era, or null for the finale */
  next: string | null;
  palette: { bg: string; girder: number; ladder: number };
  map: string[];
  /** girder row index -> direction hazards roll while on it (-1 left, 1 right) */
  rollDirs: Record<number, number>;
  hazardSpeed: number;
  hazardDelayMs: number;
  hazardCap: number;
}
