import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create() {
    // Phase-1 placeholder textures — replaced by real pixel-art sprites later.
    const g = this.make.graphics({ x: 0, y: 0 }, false);

    g.fillStyle(0x31f7e0, 1).fillRect(0, 0, 24, 32);
    g.generateTexture("player", 24, 32);
    g.clear();

    g.fillStyle(0x466399, 1).fillRect(0, 0, 96, 16);
    g.generateTexture("platform", 96, 16);
    g.clear();

    g.fillStyle(0x8f4699, 1).fillCircle(8, 8, 8);
    g.generateTexture("hazard", 16, 16);
    g.destroy();

    this.scene.start("menu");
  }
}
