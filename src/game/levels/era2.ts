import type { LevelConfig } from "./types";

const era2: LevelConfig = {
  key: "era2",
  title: "ERA 2 — LONDON CALLING",
  intro: {
    title: "ERA 2 — LONDON CALLING",
    lines: [
      "London, early 2000s.",
      "MCSE in hand, you're contracting across the city —",
      "systems management, support, the odd Exchange meltdown.",
      "Grey skies. Full inbox. Survive the contract.",
    ],
  },
  outro: "Contract delivered. Time to head home.",
  next: "era3",
  palette: { bg: "#14181f", girder: 0x9aa7bd, ladder: 0x8fa8d8, bgTile: 8, bgTint: 0x4a5568 },
  boss: {
    name: "THE Y2K BUG",
    scale: 3,
    parts: [{ tex: "chars", frame: 25, dx: 0, dy: 0 }],
  },
  hazard: { tex: "chars", frame: 24, scale: 1.5, spin: false }, // ticket bug — pager storms
  hazardSpeed: 120,
  hazardDelayMs: 2100,
  hazardCap: 5,
  rollDirs: { 3: 1, 6: -1, 9: 1, 12: -1, 16: 1 },
  map: [
    ".........................",
    ".........................",
    "..S................G.....",
    "####################H####",
    "....................H....",
    ".......O..........H......",
    "####H####################",
    "....H....................",
    "....H...............W....",
    "###############H#########",
    "...............H.........",
    "..P............H.........",
    "#####H#############H#####",
    ".....H.............H.....",
    ".....H........C...H......",
    ".X...H.....R.....H....B..",
    "#########################",
    ".........................",
    ".........................",
  ],
};

export default era2;
