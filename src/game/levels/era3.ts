import type { LevelConfig } from "./types";

const era3: LevelConfig = {
  key: "era3",
  title: "ERA 3 — THE LONG GAME",
  intro: {
    title: "ERA 3 — THE LONG GAME",
    lines: [
      "Back home. Courts — later Unicomer.",
      "Twenty years as Systems Analyst for a retail empire",
      "spanning the Caribbean. Batch jobs, POS fleets,",
      "Christmas rushes. Keep the lights on.",
    ],
  },
  outro: "Twenty years logged. One more chapter.",
  next: "era4",
  palette: { bg: "#1a1420", girder: 0xc9b58a, ladder: 0xffffff, bgTile: 13, bgTint: 0x6b5a4a },
  boss: {
    name: "POS GREMLIN",
    scale: 3,
    parts: [{ tex: "chars", frame: 12, dx: 0, dy: 0 }],
  },
  hazard: { tex: "chars", frame: 23, scale: 1.5, spin: false }, // bug — batch jobs
  hazardSpeed: 125,
  hazardDelayMs: 2000,
  hazardCap: 6,
  rollDirs: { 3: -1, 6: 1, 9: -1, 12: 1, 16: 1 },
  map: [
    ".........................",
    ".........................",
    ".G.................S.....",
    "####H####################",
    "....H....................",
    "....H...........P........",
    "#####################H###",
    ".....................H...",
    ".O...................H...",
    "#########H###############",
    ".........H...............",
    ".........H...........W...",
    "##H#############H########",
    "..H..............H.......",
    "..H......C......H........",
    ".X.H...R.........H..P....",
    "#########################",
    ".........................",
    ".........................",
  ],
};

export default era3;
