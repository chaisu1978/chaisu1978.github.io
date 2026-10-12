export interface LevelConfig {
  key: string;
  title: string;
  intro: { title: string; lines: string[] };
  /** line shown on the level-complete screen */
  outro?: string;
  /** level key of the next era, or null for the finale */
  next: string | null;
  palette: { bg: string; girder: number; ladder: number; bgTile: number; bgTint: number };
  /** villain-at-the-top boss: throws hazards DK-style from the 'S' spawn */
  boss: {
    name: string;
    parts: { tex: string; frame: number; dx: number; dy: number }[];
    scale: number;
  };
  map: string[];
  /** girder row index -> direction hazards roll while on it (-1 left, 1 right) */
  rollDirs: Record<number, number>;
  hazardSpeed: number;
  hazardDelayMs: number;
  hazardCap: number;
}
