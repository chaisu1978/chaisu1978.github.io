import Phaser from "phaser";
import { gameConfig } from "./config";
import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";
import StoryCardScene from "./scenes/StoryCardScene";
import LevelScene from "./scenes/LevelScene";
import EndScene from "./scenes/EndScene";

export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    ...gameConfig,
    parent,
    scene: [BootScene, MenuScene, StoryCardScene, LevelScene, EndScene],
  });
}
