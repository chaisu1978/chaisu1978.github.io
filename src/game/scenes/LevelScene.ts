import Phaser from "phaser";
import { LEVELS, type LevelConfig } from "../levels";

const TILE = 32;
const RUN_SPEED = 200;
const CLIMB_SPEED = 150;
const JUMP_VELOCITY = -520;

const HUD_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: '"Sora", sans-serif',
  fontSize: "15px",
  color: "#f2f2f2",
};

export default class LevelScene extends Phaser.Scene {
  private level!: LevelConfig;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private hazards!: Phaser.Physics.Arcade.Group;
  private pickups!: Phaser.Physics.Arcade.StaticGroup;
  private ladderZones: Phaser.Geom.Rectangle[] = [];
  private climbing = false;
  private invincible = false;
  private done = false;
  private uptime = 3;
  private score = 0;
  private uptimeText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
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
    this.uptime = 3;
    this.score = 0;
  }

  create() {
    const map = this.level.map;
    this.groundKillY = map.length * TILE;

    let spawn = { x: 64, y: 400 };
    let goal = { x: 0, y: 0 };
    let spawner = { x: 0, y: 0 };
    const ladderCells: { x: number; y: number }[] = [];

    this.platforms = this.physics.add.staticGroup();
    this.pickups = this.physics.add.staticGroup();
    this.hazards = this.physics.add.group();

    map.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const cx = x * TILE + TILE / 2;
        const cy = y * TILE + TILE / 2;
        switch (ch) {
          case "#": {
            const p = this.platforms.create(cx, cy, "girder") as Phaser.Physics.Arcade.Sprite;
            p.setData("rollDir", this.level.rollDirs[y] ?? 0);
            p.refreshBody();
            break;
          }
          case "H":
            this.add.image(cx, cy, "ladder");
            ladderCells.push({ x, y });
            break;
          case "P": {
            const pk = this.pickups.create(cx, cy, "pickup") as Phaser.Physics.Arcade.Sprite;
            pk.refreshBody();
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
        }
      });
    });

    this.buildLadderZones(ladderCells);

    this.player = this.physics.add.sprite(spawn.x, spawn.y, "player");
    this.player.setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(20, 28);
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.hazards, this.platforms, this.steerHazard, undefined, this);
    this.physics.add.overlap(this.player, this.hazards, this.onHit, undefined, this);
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
    this.uptimeText = this.add.text(420, 8, "", HUD_STYLE).setScrollFactor(0);
    this.scoreText = this.add.text(788, 8, "", HUD_STYLE).setOrigin(1, 0).setScrollFactor(0);
    this.refreshHud();
  }

  private refreshHud() {
    this.uptimeText.setText(`UPTIME ${"▮".repeat(this.uptime)}`);
    this.scoreText.setText(`SCORE ${String(this.score).padStart(5, "0")}`);
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
    (pkObj as Phaser.Physics.Arcade.Sprite).destroy();
    this.score += 25;
    this.refreshHud();
  }

  private onHit(_p: object, hazardObj: object) {
    if (this.invincible || this.done) return;
    this.uptime -= 1;
    this.refreshHud();
    if (this.uptime <= 0) {
      this.gameOver();
      return;
    }
    this.invincible = true;
    const hazard = hazardObj as Phaser.Physics.Arcade.Sprite;
    this.player.setVelocityY(-320);
    this.player.setVelocityX(this.player.x < hazard.x ? -160 : 160);
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
    this.score += 500 + this.uptime * 100;
    this.scene.start("end", {
      victory: true,
      score: this.score,
      level: this.level.key,
      subtitle: "MCSE claimed. London awaits.",
    });
  }

  private gameOver() {
    this.done = true;
    this.scene.start("end", { victory: false, score: this.score, level: this.level.key });
  }

  update() {
    if (this.done) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const zone = this.ladderZones.find((z) => z.contains(this.player.x, this.player.y));
    const up = this.cursors.up.isDown;
    const down = this.cursors.down.isDown;
    const jump = Phaser.Input.Keyboard.JustDown(this.cursors.space) || (up && !zone);

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

      const onGround = body.blocked.down || body.touching.down;
      if (jump && onGround) this.player.setVelocityY(JUMP_VELOCITY);
    }

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
