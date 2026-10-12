import type { LevelConfig } from "./types";

const era4: LevelConfig = {
  key: "era4",
  title: "ERA 4 — FULL-STACK REMOTE",
  intro: {
    title: "ERA 4 — FULL-STACK REMOTE",
    lines: [
      "Today. Remote full-stack dev for a",
      "logistics & trucking startup.",
      "Merge conflicts, failing pipelines, 2 a.m. pages —",
      "and a Friday 4 p.m. deploy waiting at the top.",
    ],
  },
  next: null,
  palette: { bg: "#030813", girder: 0x7fd6e0, ladder: 0xffffff, bgTile: 9, bgTint: 0x1d3a4a },
  boss: {
    name: "THE DEPLOY TRUCK",
    scale: 3,
    parts: [{ tex: "chars", frame: 21, dx: 0, dy: 0 }],
    hp: 5, // Option B fight: resolve incidents to damage; door stays locked
  },
  hazard: { tex: "chars", frame: 19, scale: 1.8, spin: false }, // truck — merge conflicts
  hazardSpeed: 135,
  hazardDelayMs: 1800,
  hazardCap: 6,
  rollDirs: { 3: 1, 6: -1, 9: 1, 12: -1, 16: 1 },
  map: [
    ".........................",
    ".........................",
    "..S..................G.",
    "#####################H###",
    ".....................H...",
    "......O..............H...",
    "###H#####################",
    "...H.....................",
    "...H.......R.........P...",
    "#################H#######",
    ".................H.......",
    ".................H...C...",
    "#######H#############H###",
    ".......H.............H...",
    ".......H....P.......H....",
    "..X....H.............H..R.",
    "#########################",
    ".........................",
    ".........................",
  ],
};

export default era4;
