export interface LevelConfig {
  key: string;
  title: string;
  map: string[];
  /** girder row index -> direction hazards roll while on it (-1 left, 1 right) */
  rollDirs: Record<number, number>;
  hazardSpeed: number;
  hazardDelayMs: number;
  hazardCap: number;
}
