import Phaser from "phaser";

export interface StoryCardData {
  title: string;
  lines: string[];
  next: { scene: string; data?: object };
}

export default class StoryCardScene extends Phaser.Scene {
  private card!: StoryCardData;

  constructor() {
    super("story");
  }

  init(data: StoryCardData) {
    this.card = data;
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 120, this.card.title, {
        fontFamily: '"Sora", sans-serif',
        fontSize: "34px",
        color: "#31f7e0",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 10, this.card.lines.join("\n"), {
        fontFamily: '"Sora", sans-serif',
        fontSize: "18px",
        color: "#c7cbd2",
        align: "center",
        lineSpacing: 12,
      })
      .setOrigin(0.5);

    const prompt = this.add
      .text(width / 2, height - 70, "CLICK / TAP TO CONTINUE", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "16px",
        color: "#8fa8d8",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.25,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    const advance = () => this.scene.start(this.card.next.scene, this.card.next.data);
    this.input.once("pointerdown", advance);
    this.input.keyboard?.once("keydown", advance);
  }
}
