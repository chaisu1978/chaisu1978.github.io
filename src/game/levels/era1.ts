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
  outro: "MCSE claimed. London awaits.",
  next: "era2",
  palette: { bg: "#0a1626", girder: 0xffffff, ladder: 0xffffff, bgTile: 9, bgTint: 0x334a77 },
  boss: {
    name: "SYSTEM CORE",
    scale: 2,
    parts: [
      { tex: "tiles", frame: 93, dx: -9, dy: -9 },
      { tex: "tiles", frame: 94, dx: 9, dy: -9 },
      { tex: "tiles", frame: 113, dx: -9, dy: 9 },
      { tex: "tiles", frame: 114, dx: 9, dy: 9 },
    ],
  },
  hazard: { tex: "chars", frame: 8, scale: 1.5, spin: true }, // sawblade — server errors
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
