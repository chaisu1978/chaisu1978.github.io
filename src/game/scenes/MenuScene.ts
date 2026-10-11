import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 120, "TERRENCE'S\nTECH ADVENTURE", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "48px",
        color: "#31f7e0",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const eras = [
      "1. Dial-Up Days — Trinidad ISP, late '90s",
      "2. London Calling — contractor, early 2000s",
      "3. The Long Game — Courts / Unicomer",
      "4. Full-Stack Remote — today",
    ];

    this.add
      .text(width / 2, height / 2 + 10, eras.join("\n"), {
        fontFamily: '"Sora", sans-serif',
        fontSize: "18px",
        color: "#c7cbd2",
        align: "center",
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    const prompt = this.add
      .text(width / 2, height - 80, "CLICK / TAP TO PLAY", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "20px",
        color: "#f2f2f2",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.input.once("pointerdown", () => this.scene.start("playground"));
    this.input.keyboard?.once("keydown", () => this.scene.start("playground"));
  }
}
