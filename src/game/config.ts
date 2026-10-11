import Phaser from "phaser";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#030813",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 900 },
      debug: false,
    },
  },
  render: {
    pixelArt: true,
    antialias: false,
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
