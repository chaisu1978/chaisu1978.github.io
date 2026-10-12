import Phaser from "phaser";
import { LEVELS, type LevelConfig } from "../levels";
import { sfx } from "../audio";
import { storage, DIFF_MODS } from "../storage";

const TILE = 36; // Kenney 18px tiles @ 2x
const RUN_SPEED = 225;
const CLIMB_SPEED = 170;
const JUMP_VELOCITY = -580;
const WINDOW_DURATION = 8000;
const UPTIME_MAX = 3;

const HUD_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: '"Sora", sans-serif',
  fontSize: "15px",
  color: "#f2f2f2",
};

// Kenney spritesheet frames (see BootScene preload)
const PICKUP_SPRITES: Record<string, { tex: string; frame?: number }> = {
  P: { tex: "tiles", frame: 152 }, // gold coin
  C: { tex: "tiles", frame: 27 }, // golden key
  O: { tex: "tiles", frame: 45 }, // heart
  B: { tex: "tiles", frame: 26 }, // crate
  W: { tex: "window" }, // generated wrench
};

const PICKUP_TOASTS: Record<string, string> = {
  P: "+25",
  C: "DOUBLE JUMP CERTIFIED",
  O: "UPTIME RESTORED",
  B: "BACKUP READY",
  W: "MAINTENANCE WINDOW",
};

export default class LevelScene extends Phaser.Scene {
  private level!: LevelConfig;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private eKey!: Phaser.Input.Keyboard.Key;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private hazards!: Phaser.Physics.Arcade.Group;
  private incidents!: Phaser.Physics.Arcade.Group;
  private pickups!: Phaser.Physics.Arcade.StaticGroup;
  private ladderZones: Phaser.Geom.Rectangle[] = [];
  private climbing = false;
  private invincible = false;
  private done = false;
  private uptime = UPTIME_MAX;
  private score = 0;
  private hasDoubleJump = false;
  private canAirJump = false;
  private hasShield = false;
  private windowUntil = 0;
  private skillTotal = 0;
  private skillCollected = 0;
  private uptimeText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private buffText!: Phaser.GameObjects.Text;
  private resolvePrompt!: Phaser.GameObjects.Text;
  private groundKillY = 0;
  private boss!: Phaser.GameObjects.Container;
  private spawnEvent!: Phaser.Time.TimerEvent;
  private surged = false;
  private surgeY = 0;
  private hazardSpeed = 0;
  private mods = DIFF_MODS.casual;
  private touch = { left: false, right: false, up: false, down: false };
  private touchJump = false;
  private touchE = false;
  private reducedMotion = false;

  constructor() {
    super("level");
  }

  init(data: { level?: string }) {
    this.level = LEVELS[data.level ?? "era1"];
    this.ladderZones = [];
    this.climbing = false;
    this.invincible = false;
    this.done = false;
    this.uptime = UPTIME_MAX;
    this.score = 0;
    this.hasDoubleJump = false;
    this.canAirJump = false;
    this.hasShield = false;
    this.windowUntil = 0;
    this.skillTotal = 0;
    this.skillCollected = 0;
    this.surged = false;
    this.mods = DIFF_MODS[storage.difficulty];
    this.hazardSpeed = this.level.hazardSpeed * this.mods.speed;
    this.touch = { left: false, right: false, up: false, down: false };
    this.touchJump = false;
    this.touchE = false;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  create() {
    const map = this.level.map;
    this.groundKillY = map.length * TILE;
    this.cameras.main.setBackgroundColor(this.level.palette.bg);

    // era-themed background band (Kenney bg tiles, tinted to palette)
    const band = this.add
      .tileSprite(0, 300, 900, 120, "bgs", this.level.palette.bgTile)
      .setOrigin(0, 0)
      .setDepth(-1)
      .setAlpha(0.35)
      .setTint(this.level.palette.bgTint);
    band.tileScaleX = 2;
    band.tileScaleY = 2;

    let spawn = { x: 64, y: 400 };
    let goal = { x: 0, y: 0 };
    let spawner = { x: 0, y: 0 };
    const ladderCells: { x: number; y: number }[] = [];

    this.platforms = this.physics.add.staticGroup();
    this.pickups = this.physics.add.staticGroup();
    this.hazards = this.physics.add.group();
    this.incidents = this.physics.add.group();

    map.forEach((row, y) => {
      let runStart = -1;
      const flushRun = (endX: number) => {
        if (runStart < 0) return;
        // one static body per contiguous girder run — no per-tile gaps
        const w = (endX - runStart) * TILE;
        const zone = this.add.zone(runStart * TILE + w / 2, y * TILE + TILE / 2, w, TILE);
        zone.setData("rollDir", this.level.rollDirs[y] ?? 0);
        this.physics.add.existing(zone, true);
        this.platforms.add(zone);
        runStart = -1;
      };

      [...row].forEach((ch, x) => {
        const cx = x * TILE + TILE / 2;
        const cy = y * TILE + TILE / 2;
        if (ch !== "#") flushRun(x);
        switch (ch) {
          case "#": {
            if (runStart < 0) runStart = x;
            this.add.image(cx, cy, "tiles", 13).setScale(2).setTint(this.level.palette.girder);
            break;
          }
          case "H":
            ladderCells.push({ x, y });
            break;
          case "R": {
            const r = this.incidents.create(cx, cy, "chars", 25) as Phaser.Physics.Arcade.Sprite;
            r.setScale(1.5);
            (r.body as Phaser.Physics.Arcade.Body).setSize(20, 20);
            break;
          }
          case "X":
            spawn = { x: cx, y: cy };
            break;
          case "G":
            goal = { x: cx, y: cy };
            break;
          case "S":
            spawner = { x: cx, y: cy };
            break;
          default: {
            const spec = PICKUP_SPRITES[ch];
            if (spec) {
              const pk = this.pickups.create(cx, cy, spec.tex, spec.frame) as Phaser.Physics.Arcade.Sprite;
              pk.setScale(1.5);
              pk.setData("type", ch);
              pk.refreshBody();
              if (ch === "P") this.skillTotal += 1;
            }
          }
        }
      });
      flushRun(map[0].length);
    });

    this.buildLadderZones(ladderCells);

    // top girder row → reaching it triggers the boss surge
    const topGirderRow = map.findIndex((row) => row.includes("#"));
    this.surgeY = (topGirderRow + 1) * TILE;

    // boss — villain at the top throwing hazards DK-style
    const bossSpec = this.level.boss;
    this.boss = this.add.container(spawner.x, spawner.y - 8);
    bossSpec.parts.forEach((pt) => {
      this.boss.add(
        this.add.image(pt.dx * bossSpec.scale, pt.dy * bossSpec.scale, pt.tex, pt.frame).setScale(bossSpec.scale)
      );
    });
    if (!this.reducedMotion) {
      this.tweens.add({
        targets: this.boss,
        y: this.boss.y - 8,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
    this.add
      .text(spawner.x, spawner.y - 62, bossSpec.name, {
        fontFamily: '"Sora", sans-serif',
        fontSize: "11px",
        color: "#f1bcf8",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // spawn marker = the row the player stands IN; feet rest on the tile below
    this.player = this.physics.add.sprite(spawn.x, spawn.y - 6, "chars", 9);
    this.player.setScale(2);
    this.player.setCollideWorldBounds(true);
    const pbody = this.player.body as Phaser.Physics.Arcade.Body;
    pbody.setSize(13, 21);
    pbody.setOffset(5.5, 3);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.hazards, this.platforms, this.steerHazard, undefined, this);
    this.physics.add.collider(this.incidents, this.platforms);
    this.physics.add.overlap(this.player, this.hazards, this.onHit, undefined, this);
    this.physics.add.overlap(this.player, this.incidents, this.onHit, undefined, this);
    this.physics.add.overlap(this.player, this.pickups, this.onCollect, undefined, this);

    const goalZone = this.add.zone(goal.x, goal.y + 4, TILE * 2, TILE * 2);
    this.physics.add.existing(goalZone, true);
    this.physics.add.overlap(this.player, goalZone, () => this.complete());
    // goal = door to the next era (two stacked door tiles)
    const server = this.add.image(goal.x, goal.y + 10, "tiles", 130).setOrigin(0.5, 1).setScale(2);
    this.add.image(goal.x, goal.y + 10, "tiles", 150).setOrigin(0.5, 0).setScale(2);
    const beacon = this.add
      .text(goal.x, goal.y - 66, "▼", { fontSize: "20px", color: "#31f7e0" })
      .setOrigin(0.5, 1);
    if (!this.reducedMotion) {
      this.tweens.add({
        targets: beacon,
        y: beacon.y + 8,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.tweens.add({ targets: server, alpha: 0.65, duration: 900, yoyo: true, repeat: -1 });
    }

    this.spawnEvent = this.time.addEvent({
      delay: this.level.hazardDelayMs * this.mods.delay,
      loop: true,
      callback: () => this.spawnHazard(spawner),
    });
    this.time.delayedCall(1200, () => this.spawnHazard(spawner));

    this.input.keyboard!.on("keydown-P", () => {
      if (this.done) return;
      this.scene.launch("pause");
      this.scene.pause();
    });

    this.buildHud();
    if (this.sys.game.device.input.touch) this.buildTouchControls();
  }

  private buildLadderZones(cells: { x: number; y: number }[]) {
    const cols = new Map<number, number[]>();
    cells.forEach((c) => {
      const col = cols.get(c.x) ?? [];
      col.push(c.y);
      cols.set(c.x, col);
    });

    cols.forEach((rows, x) => {
      rows.sort((a, b) => a - b);
      let start = rows[0];
      let prev = rows[0];
      const flush = (end: number) => {
        for (let r = start; r <= end; r++) {
          const frame = r === start ? 51 : 71; // ladder top cap vs mid rung
          this.add
            .image(x * TILE + TILE / 2, r * TILE + TILE / 2, "tiles", frame)
            .setScale(2)
            .setTint(this.level.palette.ladder);
        }
        this.ladderZones.push(
          new Phaser.Geom.Rectangle(x * TILE + 5, start * TILE - 12, TILE - 10, (end - start + 1) * TILE + 20)
        );
      };
      for (let i = 1; i <= rows.length; i++) {
        if (i === rows.length || rows[i] !== prev + 1) {
          flush(prev);
          start = rows[i];
        }
        prev = rows[i];
      }
    });
  }

  private buildTouchControls() {
    const btn = (x: number, y: number, r: number, label: string, on: () => void, off?: () => void) => {
      this.add
        .circle(x, y, r, 0xffffff, 0.12)
        .setScrollFactor(0)
        .setDepth(90)
        .setStrokeStyle(2, 0xffffff, 0.3);
      this.add
        .text(x, y, label, { fontFamily: '"Sora", sans-serif', fontSize: `${r * 0.9}px`, color: "#f2f2f2" })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(91)
        .setAlpha(0.6);
      const zone = this.add
        .zone(x, y, r * 2.4, r * 2.4)
        .setScrollFactor(0)
        .setDepth(92)
        .setInteractive();
      zone.on("pointerdown", on);
      if (off) {
        zone.on("pointerup", off);
        zone.on("pointerout", off);
      }
    };

    const H = 684;
    btn(70, H - 60, 38, "◀", () => (this.touch.left = true), () => (this.touch.left = false));
    btn(180, H - 60, 38, "▶", () => (this.touch.right = true), () => (this.touch.right = false));
    btn(740, H - 120, 32, "▲", () => (this.touch.up = true), () => (this.touch.up = false));
    btn(740, H - 40, 32, "▼", () => (this.touch.down = true), () => (this.touch.down = false));
    btn(845, H - 70, 44, "A", () => (this.touchJump = true));
    btn(845, H - 160, 26, "E", () => (this.touchE = true));
  }

  private buildHud() {
    this.add.rectangle(0, 0, 900, 34, 0x000000, 0.55).setOrigin(0, 0).setScrollFactor(0);
    this.add.text(12, 8, this.level.title, { ...HUD_STYLE, color: "#8fa8d8" }).setScrollFactor(0);
    this.uptimeText = this.add.text(440, 8, "", HUD_STYLE).setScrollFactor(0);
    this.buffText = this.add
      .text(450, 36, "", { ...HUD_STYLE, fontSize: "12px", color: "#31f7e0" })
      .setOrigin(0.5, 0)
      .setScrollFactor(0);
    this.scoreText = this.add.text(888, 8, "", HUD_STYLE).setOrigin(1, 0).setScrollFactor(0);
    this.resolvePrompt = this.add
      .text(0, 0, "[E] RESOLVE", { fontFamily: '"Sora", sans-serif', fontSize: "11px", color: "#fadbff" })
      .setOrigin(0.5, 1)
      .setVisible(false);
    this.refreshHud();
  }

  private refreshHud() {
    this.uptimeText.setText(`UPTIME ${"▮".repeat(this.uptime)}`);
    this.scoreText.setText(`SCORE ${String(this.score).padStart(5, "0")}`);
  }

  private refreshBuffs() {
    const buffs: string[] = [];
    if (this.hasDoubleJump) buffs.push("2×JUMP");
    if (this.hasShield) buffs.push("SHIELD");
    const windowLeft = this.windowUntil - this.time.now;
    if (windowLeft > 0) buffs.push(`WRENCH ${Math.ceil(windowLeft / 1000)}s`);
    this.buffText.setText(buffs.join("   ·   "));
  }

  private toast(message: string) {
    const t = this.add
      .text(this.player.x, this.player.y - 30, message, {
        fontFamily: '"Sora", sans-serif',
        fontSize: "13px",
        color: "#31f7e0",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: t,
      y: t.y - 36,
      alpha: 0,
      duration: 1100,
      ease: "Sine.easeOut",
      onComplete: () => t.destroy(),
    });
  }

  private get windowActive() {
    return this.time.now < this.windowUntil;
  }

  private steerHazard(hazardObj: object, platformObj: object) {
    const h = hazardObj as Phaser.Physics.Arcade.Sprite;
    const body = h.body as Phaser.Physics.Arcade.Body;
    if (!body.touching.down) return;
    const dir = (platformObj as Phaser.Physics.Arcade.Sprite).getData("rollDir") as number;
    if (dir) h.setVelocityX(dir * this.hazardSpeed);
  }

  private spawnHazard(at: { x: number; y: number }) {
    if (this.done || this.hazards.countActive(true) >= this.level.hazardCap) return;
    const h = this.hazards.create(at.x, at.y, "chars", 8) as Phaser.Physics.Arcade.Sprite;
    h.setScale(1.5);
    h.setCollideWorldBounds(true);
    (h.body as Phaser.Physics.Arcade.Body).setCircle(11);
    h.setVelocityX(-this.hazardSpeed);
    h.setData("bornAt", this.time.now);
  }

  private onCollect(_p: object, pkObj: object) {
    const pk = pkObj as Phaser.Physics.Arcade.Sprite;
    const type = pk.getData("type") as string;
    pk.destroy();

    if (type === "P") sfx.collect();
    else sfx.power();

    switch (type) {
      case "P":
        this.skillCollected += 1;
        this.score += 25;
        break;
      case "C":
        this.hasDoubleJump = true;
        break;
      case "O":
        if (this.uptime < UPTIME_MAX) this.uptime += 1;
        else this.score += 50;
        break;
      case "B":
        this.hasShield = true;
        break;
      case "W":
        this.windowUntil = this.time.now + WINDOW_DURATION;
        this.player.setTint(0xffd76b);
        break;
    }

    this.toast(PICKUP_TOASTS[type] ?? "+25");
    this.refreshHud();
  }

  private onHit(_p: object, threatObj: object) {
    if (this.done || this.invincible) return;
    const threat = threatObj as Phaser.Physics.Arcade.Sprite;

    if (this.windowActive) {
      threat.destroy();
      this.score += 100;
      this.refreshHud();
      this.toast("+100 SMASHED");
      sfx.smash();
      return;
    }

    if (this.hasShield) {
      this.hasShield = false;
      this.flashPlayer();
      this.toast("RESTORED FROM BACKUP");
      sfx.resolve();
      return;
    }

    this.uptime -= 1;
    this.refreshHud();
    sfx.hit();
    if (this.uptime <= 0) {
      this.gameOver();
      return;
    }

    this.player.setVelocityY(-320);
    this.player.setVelocityX(this.player.x < threat.x ? -160 : 160);
    this.flashPlayer();
  }

  private flashPlayer() {
    this.invincible = true;
    if (this.reducedMotion) {
      // no flicker — plain timed invincibility window
      this.time.delayedCall(1400, () => {
        this.invincible = false;
      });
      return;
    }
    this.tweens.add({
      targets: this.player,
      alpha: 0.25,
      duration: 120,
      yoyo: true,
      repeat: 6,
      onComplete: () => {
        this.player.setAlpha(1);
        this.invincible = false;
      },
    });
  }

  private complete() {
    if (this.done) return;
    this.done = true;
    sfx.win();
    this.flashBanner("LEVEL COMPLETE", "#31f7e0");
    this.time.delayedCall(1400, () => this.advanceFromComplete());
  }

  private flashBanner(text: string, color: string) {
    const banner = this.add
      .text(450, 140, text, {
        fontFamily: '"Sora", sans-serif',
        fontSize: "30px",
        color,
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setScale(0.6);
    this.tweens.add({ targets: banner, scale: 1, duration: 300, ease: "Back.easeOut" });
  }

  private advanceFromComplete() {
    let bonus = 500 + this.uptime * 100;
    const certified = this.skillTotal > 0 && this.skillCollected === this.skillTotal;
    if (certified) bonus += 250;
    this.score += bonus;

    const next = this.level.next;
    if (next) {
      const nextIntro = LEVELS[next].intro;
      this.scene.start("end", {
        victory: true,
        score: this.score,
        level: this.level.key,
        subtitle: certified ? "CERTIFIED — all skills collected" : this.level.outro,
        continueTo: {
          scene: "story",
          data: { ...nextIntro, next: { scene: "level", data: { level: next } } },
        },
      });
    } else {
      this.scene.start("end", {
        victory: true,
        final: true,
        score: this.score,
        level: this.level.key,
        subtitle: certified ? "CERTIFIED. 25+ years. Still shipping." : "25+ years. Still shipping.",
      });
    }
  }

  private gameOver() {
    this.done = true;
    sfx.lose();
    this.flashBanner("SYSTEM DOWN", "#935252");
    this.time.delayedCall(1400, () =>
      this.scene.start("end", { victory: false, score: this.score, level: this.level.key })
    );
  }

  private nearestIncident(): Phaser.Physics.Arcade.Sprite | null {
    let best: Phaser.Physics.Arcade.Sprite | null = null;
    let bestDist = 72;
    this.incidents.getChildren().forEach((obj) => {
      const r = obj as Phaser.Physics.Arcade.Sprite;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, r.x, r.y);
      if (d < bestDist) {
        best = r;
        bestDist = d;
      }
    });
    return best;
  }

  update() {
    if (this.done) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const zone = this.ladderZones.find((z) => z.contains(this.player.x, this.player.y));
    const up = this.cursors.up.isDown || this.touch.up;
    const down = this.cursors.down.isDown || this.touch.down;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      this.touchJump;
    const ladderJump = Phaser.Input.Keyboard.JustDown(this.cursors.space) || this.touchJump;
    this.touchJump = false;
    const onGround = body.blocked.down || body.touching.down;

    if (zone && (up || down)) this.climbing = true;
    if (!zone) {
      this.climbing = false;
      body.allowGravity = true;
    }

    if (this.climbing && zone) {
      body.allowGravity = false;
      this.player.setVelocityY(up ? -CLIMB_SPEED : down ? CLIMB_SPEED : 0);
      this.player.setVelocityX(0);
      this.player.x = Phaser.Math.Linear(this.player.x, zone.centerX, 0.2);
      if (ladderJump) {
        this.climbing = false;
        body.allowGravity = true;
        this.player.setVelocityY(JUMP_VELOCITY * 0.75);
        sfx.jump();
      }
    } else {
      if (this.cursors.left.isDown || this.touch.left) {
        this.player.setVelocityX(-RUN_SPEED);
        this.player.setFlipX(true);
      } else if (this.cursors.right.isDown || this.touch.right) {
        this.player.setVelocityX(RUN_SPEED);
        this.player.setFlipX(false);
      } else {
        this.player.setVelocityX(0);
      }

      if (onGround) {
        this.canAirJump = this.hasDoubleJump;
        if (jumpPressed) {
          this.player.setVelocityY(JUMP_VELOCITY);
          sfx.jump();
        }
      } else if (jumpPressed && this.canAirJump) {
        this.canAirJump = false;
        this.player.setVelocityY(JUMP_VELOCITY * 0.9);
        sfx.jump();
      }
    }

    // resolve prompt + E key
    const incident = this.nearestIncident();
    if (incident) {
      this.resolvePrompt.setPosition(incident.x, incident.y - 14).setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.eKey) || this.touchE) {
        incident.destroy();
        this.score += 75;
        this.refreshHud();
        this.toast("+75 INCIDENT RESOLVED");
        sfx.resolve();
      }
      this.touchE = false;
    } else {
      this.resolvePrompt.setVisible(false);
    }

    // boss surge — reaching the top girder enrages the boss
    if (!this.surged && this.player.y < this.surgeY) {
      this.surged = true;
      this.spawnEvent.reset({ delay: this.level.hazardDelayMs * 0.45 * this.mods.delay, loop: true, repeat: -1 });
      this.hazardSpeed = this.level.hazardSpeed * 1.3 * this.mods.speed;
      this.boss.setScale(1.15);
      this.boss.iterate((child: Phaser.GameObjects.GameObject) =>
        (child as Phaser.GameObjects.Image).setTint(0xffb0b0)
      );
      this.flashBanner(`${this.level.boss.name} ENRAGED`, "#f1bcf8");
    }

    // maintenance window expiry
    if (!this.windowActive && this.windowUntil > 0) {
      this.windowUntil = 0;
      this.player.clearTint();
    }
    this.refreshBuffs();

    this.hazards.getChildren().forEach((obj) => {
      const h = obj as Phaser.Physics.Arcade.Sprite;
      const hb = h.body as Phaser.Physics.Arcade.Body;
      h.rotation += hb.velocity.x * 0.0005;
      const expired = this.time.now - (h.getData("bornAt") as number) > 20000;
      if (h.y > this.groundKillY + 40 || expired || ((hb.blocked.left || hb.blocked.right) && hb.blocked.down)) {
        h.destroy();
      }
    });
  }
}
