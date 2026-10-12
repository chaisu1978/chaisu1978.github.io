import Phaser from "phaser";

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("pause");
  }

  create() {
    this.add.rectangle(0, 0, 900, 684, 0x000000, 0.6).setOrigin(0, 0);
    this.add
      .text(450, 300, "PAUSED", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "42px",
        color: "#31f7e0",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.add
      .text(450, 360, "P / TAP — RESUME", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "16px",
        color: "#8fa8d8",
      })
      .setOrigin(0.5);

    const resume = () => {
      this.scene.resume("level");
      this.scene.stop();
    };
    this.input.once("pointerdown", resume);
    this.input.keyboard?.on("keydown-P", resume);
  }
}
