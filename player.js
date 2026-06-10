const GRAVITY = 1800;
const JUMP_FORCE = -620;
const MOVE_SPEED = 280;
const FRICTION = 0.82;

const Player = {
  x: 200,
  y: 0,
  width: 48,
  height: 64,
  velX: 0,
  velY: 0,
  onGround: false,
  facingRight: true,

  isSliding: false,
  slideTimer: 0,
  slideDuration: 1.0,
  slideCooldown: 0,
  slideCooldownMax: 5.0,

  init(canvas) {
    this.x = canvas.width / 2 - this.width / 2;
    this.y = WORLD.getFloorY() - this.height;
  },

  update(dt, keys, canvas) {
    const floorY = WORLD.getFloorY();

    if (keys['Digit1'] && !this.isSliding && this.slideCooldown <= 0) {
      this.isSliding = true;
      this.slideTimer = this.slideDuration;
      this.slideCooldown = this.slideCooldownMax;
      this.velX = (this.facingRight ? 1 : -1) * 520;
    }

    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    if (this.slideCooldown > 0) {
      this.slideCooldown -= dt;
    }

    if (!this.isSliding) {
      if (keys['ArrowLeft'] || keys['KeyA']) {
        this.velX -= MOVE_SPEED * dt * 10;
        this.facingRight = false;
      } else if (keys['ArrowRight'] || keys['KeyD']) {
        this.velX += MOVE_SPEED * dt * 10;
        this.facingRight = true;
      } else {
        this.velX *= FRICTION;
      }

      this.velX = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, this.velX));
    }

    if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && this.onGround) {
      this.velY = JUMP_FORCE;
      this.onGround = false;
    }

    this.velY += GRAVITY * dt;

    this.x += this.velX * dt;
    this.y += this.velY * dt;

    const currentHeight = this.isSliding ? this.height * 0.5 : this.height;
    if (this.y + currentHeight >= floorY) {
      this.y = floorY - currentHeight;
      this.velY = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    if (this.x < 0) {
      this.x = 0;
      this.velX = 0;
    }

    if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
      this.velX = 0;
    }
  },

  draw(ctx) {
    const drawHeight = this.isSliding ? this.height * 0.5 : this.height;
    const drawY = this.isSliding
      ? this.y + (this.height - drawHeight)
      : this.y;

    ctx.fillStyle = '#e8c97a';
    ctx.fillRect(this.x, drawY, this.width, drawHeight);

    ctx.fillStyle = '#333';
    const eyeX = this.facingRight
      ? this.x + this.width - 10
      : this.x + 6;

    ctx.fillRect(eyeX, drawY + 12, 6, 6);
  }
};
