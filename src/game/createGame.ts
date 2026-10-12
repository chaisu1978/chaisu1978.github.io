import Phaser from "phaser";
import { gameConfig } from "./config";
import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";
import StoryCardScene from "./scenes/StoryCardScene";
import LevelScene from "./scenes/LevelScene";
import EndScene from "./scenes/EndScene";
import PauseScene from "./scenes/PauseScene";

export function createGame(parent: HTMLElement): Phaser.Game {
  const game = new Phaser.Game({
    ...gameConfig,
    parent,
    scene: [BootScene, MenuScene, StoryCardScene, LevelScene, EndScene, PauseScene],
  });

  // auto-pause the level when the tab loses visibility
  const onHidden = () => {
    if (document.hidden && game.scene.isActive("level")) {
      const level = game.scene.getScene("level");
      level.scene.launch("pause");
      level.scene.pause();
    }
  };
  document.addEventListener("visibilitychange", onHidden);
  game.events.once(Phaser.Core.Events.DESTROY, () =>
    document.removeEventListener("visibilitychange", onHidden)
  );

  return game;
}
