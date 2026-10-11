import Phaser from "phaser";

export default class PlaygroundScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("playground");
  }

  create() {
    const { width, height } = this.scale;
    const groundY = height - 48;

    const platforms = this.physics.add.staticGroup();
    for (let x = 48; x < width + 96; x += 96) {
      platforms.create(x, groundY, "platform");
    }
    platforms.create(width * 0.3, groundY - 120, "platform");
    platforms.create(width * 0.55, groundY - 240, "platform");
    platforms.create(width * 0.75, groundY - 150, "platform");

    this.player = this.physics.add.sprite(100, groundY - 60, "player");
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.add
      .text(16, 16, "← → move · ↑ / SPACE jump\n(phase-1 playground)", {
        fontFamily: '"Sora", sans-serif',
        fontSize: "14px",
        color: "#8fa8d8",
      })
      .setScrollFactor(0);
  }

  update() {
    const speed = 220;
    const onGround = this.player.body!.blocked.down || this.player.body!.touching.down;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if ((this.cursors.up.isDown || this.cursors.space.isDown) && onGround) {
      this.player.setVelocityY(-480);
    }
  }
}
