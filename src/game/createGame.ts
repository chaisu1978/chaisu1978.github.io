import Phaser from "phaser";
import { gameConfig } from "./config";
import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";
import PlaygroundScene from "./scenes/PlaygroundScene";

export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    ...gameConfig,
    parent,
    scene: [BootScene, MenuScene, PlaygroundScene],
  });
}
