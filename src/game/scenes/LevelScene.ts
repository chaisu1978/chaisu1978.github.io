import Phaser from "phaser";
import { LEVELS, type LevelConfig } from "../levels";

const TILE = 32;
const RUN_SPEED = 200;
const CLIMB_SPEED = 150;
const JUMP_VELOCITY = -520;
const WINDOW_DURATION = 8000;
const UPTIME_MAX = 3;

const HUD_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: '"Sora", sans-serif',
  fontSize: "15px",
  color: "#f2f2f2",
};

const PICKUP_TEXTURES: Record<string, string> = {
  P: "pickup",
  C: "cert",
  O: "coffee",
  B: "backup",
  W: "window",
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
  }

  create() {
    const map = this.level.map;
    this.groundKillY = map.length * TILE;
    this.cameras.main.setBackgroundColor(this.level.palette.bg);

    let spawn = { x: 64, y: 400 };
    let goal = { x: 0, y: 0 };
    let spawner = { x: 0, y: 0 };
    const ladderCells: { x: number; y: number }[] = [];

    this.platforms = this.physics.add.staticGroup();
    this.pickups = this.physics.add.staticGroup();
    this.hazards = this.physics.add.group();
    this.incidents = this.physics.add.group();

    map.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const cx = x * TILE + TILE / 2;
        const cy = y * TILE + TILE / 2;
        switch (ch) {
          case "#": {
            const p = this.platforms.create(cx, cy, "girder") as Phaser.Physics.Arcade.Sprite;
            p.setData("rollDir", this.level.rollDirs[y] ?? 0);
            p.setTint(this.level.palette.girder);
            p.refreshBody();
            break;
          }
          case "H":
            this.add.image(cx, cy, "ladder").setTint(this.level.palette.ladder);
            ladderCells.push({ x, y });
            break;
          case "R": {
            const r = this.incidents.create(cx, cy, "incident") as Phaser.Physics.Arcade.Sprite;
            (r.body as Phaser.Physics.Arcade.Body).setSize(18, 18);
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
            const texture = PICKUP_TEXTURES[ch];
            if (texture) {
              const pk = this.pickups.create(cx, cy, texture) as Phaser.Physics.Arcade.Sprite;
              pk.setData("type", ch);
              pk.refreshBody();
              if (ch === "P") this.skillTotal += 1;
            }
          }
        }
      });
    });

    this.buildLadderZones(ladderCells);

    this.player = this.physics.add.sprite(spawn.x, spawn.y, "player");
    this.player.setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(20, 28);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.hazards, this.platforms, this.steerHazard, undefined, this);
    this.physics.add.collider(this.incidents, this.platforms);
    this.physics.add.overlap(this.player, this.hazards, this.onHit, undefined, this);
    this.physics.add.overlap(this.player, this.incidents, this.onHit, undefined, this);
    this.physics.add.overlap(this.player, this.pickups, this.onCollect, undefined, this);

    const goalZone = this.add.zone(goal.x, goal.y + 4, TILE * 2, TILE * 2);
    this.physics.add.existing(goalZone);
    this.physics.add.overlap(this.player, goalZone, () => this.complete());
    this.add.image(goal.x, goal.y + 10, "server").setOrigin(0.5, 1);

    this.time.addEvent({
      delay: this.level.hazardDelayMs,
      loop: true,
      callback: () => this.spawnHazard(spawner),
    });
    this.time.delayedCall(1200, () => this.spawnHazard(spawner));

    this.buildHud();
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
        this.ladderZones.push(
          new Phaser.Geom.Rectangle(x * TILE + 4, start * TILE - 10, TILE - 8, (end - start + 1) * TILE + 18)
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

  private buildHud() {
    this.add.rectangle(0, 0, 800, 34, 0x000000, 0.55).setOrigin(0, 0).setScrollFactor(0);
    this.add.text(12, 8, this.level.title, { ...HUD_STYLE, color: "#8fa8d8" }).setScrollFactor(0);
    this.uptimeText = this.add.text(390, 8, "", HUD_STYLE).setScrollFactor(0);
    this.buffText = this.add
      .text(400, 34, "", { ...HUD_STYLE, fontSize: "12px", color: "#31f7e0" })
      .setOrigin(0.5, 0)
      .setScrollFactor(0);
    this.scoreText = this.add.text(788, 8, "", HUD_STYLE).setOrigin(1, 0).setScrollFactor(0);
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
    if (dir) h.setVelocityX(dir * this.level.hazardSpeed);
  }

  private spawnHazard(at: { x: number; y: number }) {
    if (this.done || this.hazards.countActive(true) >= this.level.hazardCap) return;
    const h = this.hazards.create(at.x, at.y, "hazard") as Phaser.Physics.Arcade.Sprite;
    h.setCollideWorldBounds(true);
    (h.body as Phaser.Physics.Arcade.Body).setCircle(9);
    h.setVelocityX(-this.level.hazardSpeed);
    h.setData("bornAt", this.time.now);
  }

  private onCollect(_p: object, pkObj: object) {
    const pk = pkObj as Phaser.Physics.Arcade.Sprite;
    const type = pk.getData("type") as string;
    pk.destroy();

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
      return;
    }

    if (this.hasShield) {
      this.hasShield = false;
      this.flashPlayer();
      this.toast("RESTORED FROM BACKUP");
      return;
    }

    this.uptime -= 1;
    this.refreshHud();
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
    let bonus = 500 + this.uptime * 100;
    const certified = this.skillTotal > 0 && this.skillCollected === this.skillTotal;
    if (certified) bonus += 250;
    this.score += bonus;

    const next = this.level.next;
    if (next) {
      const nextIntro = LEVELS[next].intro;
      this.scene.start("story", {
        ...nextIntro,
        lines: [...nextIntro.lines, certified ? "(CERTIFIED — all skills collected)" : ""].filter(Boolean),
        next: { scene: "level", data: { level: next } },
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
    this.scene.start("end", { victory: false, score: this.score, level: this.level.key });
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
    const up = this.cursors.up.isDown;
    const down = this.cursors.down.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.up);
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
      if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
        this.climbing = false;
        body.allowGravity = true;
        this.player.setVelocityY(JUMP_VELOCITY * 0.75);
      }
    } else {
      if (this.cursors.left.isDown) this.player.setVelocityX(-RUN_SPEED);
      else if (this.cursors.right.isDown) this.player.setVelocityX(RUN_SPEED);
      else this.player.setVelocityX(0);

      if (onGround) {
        this.canAirJump = this.hasDoubleJump;
        if (jumpPressed) this.player.setVelocityY(JUMP_VELOCITY);
      } else if (jumpPressed && this.canAirJump) {
        this.canAirJump = false;
        this.player.setVelocityY(JUMP_VELOCITY * 0.9);
      }
    }

    // resolve prompt + E key
    const incident = this.nearestIncident();
    if (incident) {
      this.resolvePrompt.setPosition(incident.x, incident.y - 14).setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
        incident.destroy();
        this.score += 75;
        this.refreshHud();
        this.toast("+75 INCIDENT RESOLVED");
      }
    } else {
      this.resolvePrompt.setVisible(false);
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
