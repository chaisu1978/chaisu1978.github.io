import type { LevelConfig } from "./types";
import era1 from "./era1";
import era2 from "./era2";
import era3 from "./era3";
import era4 from "./era4";

export const LEVELS: Record<string, LevelConfig> = {
  era1,
  era2,
  era3,
  era4,
};

export type { LevelConfig };
