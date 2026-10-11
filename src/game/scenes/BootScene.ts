import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create() {
    // Phase-2 placeholder textures — replaced by real pixel-art sprites later.
    const g = this.make.graphics({ x: 0, y: 0 }, false);

    // player — teal dev with visor
    g.fillStyle(0x31f7e0, 1).fillRect(2, 8, 20, 24);
    g.fillStyle(0x15d7c0, 1).fillRect(4, 0, 16, 10);
    g.fillStyle(0x10213f, 1).fillRect(6, 3, 12, 4);
    g.generateTexture("player", 24, 32);
    g.clear();

    // girder — steel I-beam tile
    g.fillStyle(0x466399, 1).fillRect(0, 0, 32, 32);
    g.fillStyle(0x273f6c, 1).fillRect(0, 4, 32, 6).fillRect(0, 22, 32, 6);
    g.fillStyle(0x8fa8d8, 1).fillRect(0, 0, 32, 3);
    g.generateTexture("girder", 32, 32);
    g.clear();

    // ladder — rails + rungs
    g.fillStyle(0x97a1b2, 1).fillRect(4, 0, 4, 32).fillRect(24, 0, 4, 32);
    for (let y = 4; y < 30; y += 9) g.fillRect(4, y, 24, 3);
    g.generateTexture("ladder", 32, 32);
    g.clear();

    // hazard — rolling error orb
    g.fillStyle(0xaf67b8, 1).fillCircle(10, 10, 9);
    g.fillStyle(0x64276c, 1).fillCircle(10, 10, 5);
    g.generateTexture("hazard", 20, 20);
    g.clear();

    // pickup — skill diamond
    g.fillStyle(0x31f7e0, 1).fillTriangle(8, 0, 16, 8, 8, 16).fillTriangle(8, 16, 16, 8, 0, 8);
    g.fillStyle(0xf2f2f2, 1).fillCircle(8, 8, 3);
    g.generateTexture("pickup", 16, 16);
    g.clear();

    // server — the goal rack
    g.fillStyle(0x181f2c, 1).fillRect(0, 0, 28, 40);
    g.lineStyle(2, 0x466399).strokeRect(1, 1, 26, 38);
    for (let y = 6; y < 34; y += 9) {
      g.fillStyle(0x529362, 1).fillRect(5, y, 4, 4);
      g.fillStyle(0x97a1b2, 1).fillRect(12, y, 10, 3);
    }
    g.generateTexture("server", 28, 40);
    g.destroy();

    this.scene.start("menu");
  }
}
