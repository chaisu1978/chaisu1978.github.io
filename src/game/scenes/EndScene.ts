import Phaser from "phaser";

interface EndData {
  victory: boolean;
  final?: boolean;
  score: number;
  level: string;
  subtitle?: string;
  continueTo?: { scene: string; data?: object };
}

export default class EndScene extends Phaser.Scene {
  private end!: EndData;

  constructor() {
    super("end");
  }

  init(data: EndData) {
    this.end = data;
  }

  create() {
    const { width, height } = this.scale;
    const { victory, final, score, subtitle, continueTo } = this.end;
    const headline = victory ? (final ? "JOURNEY COMPLETE" : "LEVEL COMPLETE") : "SYSTEM DOWN";

    this.add
      .text(width / 2, height / 2 - 110, headline, {
        fontFamily: '"Sora", sans-serif',
        fontSize: "42px",
        color: victory ? "#31f7e0" : "#935252",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const lines = [
      subtitle ?? (victory ? "" : "Too many unhandled exceptions."),
      `SCORE ${String(score).padStart(5, "0")}`,
    ].filter(Boolean);

    this.add
      .text(width / 2, height / 2 - 10, lines.join("\n"), {
        fontFamily: '"Sora", sans-serif',
        fontSize: "20px",
        color: "#c7cbd2",
        align: "center",
        lineSpacing: 14,
      })
      .setOrigin(0.5);

    let promptText: string;
    let advance: () => void;
    if (victory && continueTo) {
      promptText = "CLICK / ENTER — NEXT ERA     M — MENU";
      advance = () => this.scene.start(continueTo.scene, continueTo.data);
    } else if (victory) {
      promptText = "CLICK / M — MENU";
      advance = () => this.scene.start("menu");
    } else {
      promptText = "CLICK / R — RETRY     M — MENU";
      advance = () => this.scene.start("level", { level: this.end.level });
    }

    const prompt = this.add
      .text(width / 2, height - 80, promptText, {
        fontFamily: '"Sora", sans-serif',
        fontSize: "16px",
        color: "#8fa8d8",
      })
      .setOrigin(0.5);

    this.tweens.add({ targets: prompt, alpha: 0.25, duration: 700, yoyo: true, repeat: -1 });

    const menu = () => this.scene.start("menu");

    this.input.once("pointerdown", advance);
    this.input.keyboard?.on("keydown-ENTER", advance);
    this.input.keyboard?.on("keydown-R", advance);
    this.input.keyboard?.on("keydown-M", menu);
  }
}
