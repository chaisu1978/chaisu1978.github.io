import Phaser from "phaser";
import { LEVELS } from "../levels";
import { storage } from "../storage";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create() {
    const { width, height } = this.scale;

    const start = () => {
      const intro = LEVELS.era1.intro;
      this.scene.start("story", {
        ...intro,
        next: { scene: "level", data: { level: "era1" } },
      });
    };
    // bottom-most interactive — any tap that isn't on the difficulty toggle
    this.add
      .zone(0, 0, width, height)
      .setOrigin(0, 0)
      .setInteractive()
      .once("pointerdown", start);
    this.input.keyboard?.once("keydown", start);

    this.add
      .text(width / 2, 90, "TERRENCE'S\nTECH ADVENTURE", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "44px",
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
      .text(width / 2, height / 2 - 10, eras.join("\n"), {
        fontFamily: '"Sora", sans-serif',
        fontSize: "17px",
        color: "#c7cbd2",
        align: "center",
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 95, "←→ move · ↑ climb/jump · E resolve · P pause", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "13px",
        color: "#8fa8d8",
      })
      .setOrigin(0.5);

    const diffText = this.add
      .text(width / 2, height / 2 + 130, "", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "15px",
        color: "#f1bcf8",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const renderDiff = () => {
      diffText.setText(`DIFFICULTY: ${storage.difficulty.toUpperCase()} — TAP TO CHANGE`);
    };
    renderDiff();
    diffText.on("pointerdown", (_p: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation();
      storage.difficulty = storage.difficulty === "casual" ? "sysadmin" : "casual";
      renderDiff();
    });

    if (storage.high > 0) {
      this.add
        .text(width / 2, height - 130, `HIGH SCORE ${String(storage.high).padStart(5, "0")}`, {
          fontFamily: '"Sora", sans-serif',
          fontSize: "15px",
          color: "#8fa8d8",
        })
        .setOrigin(0.5);
    }

    const prompt = this.add
      .text(width / 2, height - 70, "CLICK / TAP TO PLAY", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "20px",
        color: "#f2f2f2",
      })
      .setOrigin(0.5);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.tweens.add({
        targets: prompt,
        alpha: 0.2,
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

  }
}
