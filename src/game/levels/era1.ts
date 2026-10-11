import type { LevelConfig } from "./types";

// Map legend:
//   '#' solid girder/ground tile    'H' ladder (climbable, non-solid)
//   'X' player spawn                'G' goal (the server rack — claim your MCSE)
//   'S' hazard spawner              'P' pickup (skill icon, +25)
//   '.' empty air
//
// Hazards spawn at S, drop onto the top girder, and roll along each girder's
// rollDir until they hit a ladder hole and fall through to the girder below —
// the Donkey Kong "barrel" behaviour.

const era1: LevelConfig = {
  key: "era1",
  title: "ERA 1 — DIAL-UP DAYS",
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
    "......H.........H........",
    "..X...H....P....H........",
    "#########################",
    ".........................",
    ".........................",
  ],
};

export default era1;
