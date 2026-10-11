import type { LevelConfig } from "./types";

// Map legend:
//   '#' solid girder/ground tile    'H' ladder (climbable, non-solid)
//   'X' player spawn                'G' goal (the server rack)
//   'S' hazard spawner
//   'P' skill pickup (+25)          'R' resolvable incident (E to fix, +75)
//   'C' cert → double jump          'O' coffee → uptime +1
//   'B' backup → 1-hit shield       'W' maintenance window → smash mode
//   '.' empty air

const era1: LevelConfig = {
  key: "era1",
  title: "ERA 1 — DIAL-UP DAYS",
  intro: {
    title: "ERA 1 — DIAL-UP DAYS",
    lines: [
      "Trinidad, late 1990s.",
      "You're a teenage web dev at the island's ISP —",
      "dial-up lines humming, NT servers blinking.",
      "Climb the racks. Reach the server. Claim your MCSE.",
    ],
  },
  next: "era2",
  palette: { bg: "#0a1626", girder: 0xffffff, ladder: 0xffffff },
  hazardSpeed: 110,
  hazardDelayMs: 2400,
  hazardCap: 5,
  rollDirs: { 3: -1, 6: 1, 9: -1, 12: 1, 16: 1 },
  map: [
    ".........................",
    ".........................",
    ".G................S......",
    "###H#####################",
    "...H.....................",
    "...H..........P..........",
    "####################H####",
    "....................H....",
    "..........P.........H....",
    "########H################",
    "........H................",
    "........H..........P.....",
    "######H#########H########",
    "......H.........H........",
    "......H.........H...O....",
    "..X...H....P....H..R.....",
    "#########################",
    ".........................",
    ".........................",
  ],
};

export default era1;
