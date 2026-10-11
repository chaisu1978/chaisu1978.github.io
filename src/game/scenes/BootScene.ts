import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload() {
    // Kenney Pixel Platformer (CC0) — see public/game/License.txt
    this.load.spritesheet("tiles", "game/tilemap_packed.png", {
      frameWidth: 18,
      frameHeight: 18,
    });
    this.load.spritesheet("chars", "game/tilemap-characters_packed.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
    this.load.spritesheet("bgs", "game/tilemap-backgrounds_packed.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
  }

  create() {
    // Wrench for the Maintenance Window pickup — no good pack tile, so keep
    // the generated placeholder.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0x97a1b2, 1).fillCircle(8, 5, 4).fillRect(6, 5, 4, 10);
    g.fillStyle(0x030813, 1).fillRect(5, 2, 6, 4);
    g.generateTexture("window", 16, 16);
    g.destroy();

    this.scene.start("menu");
  }
}
