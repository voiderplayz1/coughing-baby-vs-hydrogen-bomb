const GRAVITY = 1800;
const JUMP_FORCE = -620;
const MOVE_SPEED = 280;
const FRICTION = 0.82;
const KNOCKBACK_FORCE = 380;

const Player = {
  x: 200,
  y: 0,
  width: 48,
  height: 64,
  velX: 0,
  velY: 0,
  onGround: false,
  facingRight: false,

  isSliding: false,
  slideTimer: 0,
  slideDuration: 1.0,
  slideCooldown: 0,
  slideCooldownMax: 5.0,

  aimAngle: 0,
  isReloading: false,
  reloadTimer: 0,
  reloadDuration: 3.0,
  canShoot: true,

  mouseX: 0,
  mouseY: 0,

  img: null,
  gunImg: null,
  sfxShoot: null,
  sfxReloadBaby: null,
  sfxReloadGun: null,
  sfxJump: null,
  reloadSfxScheduled: false,

  init(canvas) {
    this.x = canvas.width / 2 - this.width / 2;
    this.y = WORLD.getFloorY() - this.height;

    this.img = new Image();
    this.img.src = 'assets/baby.png';

    this.gunImg = new Image();
    this.gunImg.src = 'assets/shotgun.png';

    this.sfxShoot = new Audio('assets/shotgun.mp3');
    this.sfxReloadBaby = new Audio('assets/babyshotgunreload.wav');
    this.sfxReloadGun = new Audio('assets/reloadshotgun.mp3');
    this.sfxJump = new Audio('assets/jump.mp3');
  },

  onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  },

  onMouseDown(e) {
    if (e.button === 0 && this.canShoot && !this.isReloading) {
      this.shoot();
    }
  },

  shoot() {
    this.sfxShoot.currentTime = 0;
    this.sfxShoot.play();

    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const dx = this.mouseX - centerX;
    const dy = this.mouseY - centerY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / len;
    const ny = dy / len;

    this.velX -= nx * KNOCKBACK_FORCE;
    this.velY -= ny * KNOCKBACK_FORCE;

    this.canShoot = false;
    this.isReloading = true;
    this.reloadTimer = this.reloadDuration;
    this.reloadSfxScheduled = false;
  },

  update(dt, keys, canvas) {
    const floorY = WORLD.getFloorY();

    if (this.isReloading) {
      this.reloadTimer -= dt;

      if (!this.reloadSfxScheduled && this.reloadTimer <= this.reloadDuration - 1.0) {
        this.sfxReloadBaby.currentTime = 0;
        this.sfxReloadGun.currentTime = 0;
        this.sfxReloadBaby.play();
        this.sfxReloadGun.play();
        this.reloadSfxScheduled = true;
      }

      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        this.canShoot = true;
      }
    }

    if (!this.isReloading) {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      this.aimAngle = Math.atan2(this.mouseY - centerY, this.mouseX - centerX);
    } else {
      this.aimAngle = -Math.PI / 2;
    }

    if (keys['Digit1'] && !this.isSliding && this.slideCooldown <= 0) {
      this.isSliding = true;
      this.slideTimer = this.slideDuration;
      this.slideCooldown = this.slideCooldownMax;
      this.velX = (this.facingRight ? 1 : -1) * 520;
    }

    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) this.isSliding = false;
    }

    if (this.slideCooldown > 0) this.slideCooldown -= dt;

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
      this.sfxJump.currentTime = 0;
      this.sfxJump.play();
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

    if (this.x < 0) { this.x = 0; this.velX = 0; }
    if (this.x + this.width > canvas.width) { this.x = canvas.width - this.width; this.velX = 0; }
  },

  draw(ctx) {
    const drawHeight = this.isSliding ? this.height * 0.5 : this.height;
    const drawY = this.isSliding ? this.y + (this.height - drawHeight) : this.y;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    if (this.facingRight) ctx.scale(-1, 1);
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, drawHeight);
    ctx.restore();

    const gunLength = 64;
    const gunHeight = 20;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.aimAngle);
    if (Math.cos(this.aimAngle) < 0) ctx.scale(1, -1);
    ctx.drawImage(this.gunImg, 0, -gunHeight / 2, gunLength, gunHeight);
    ctx.restore();
  }
};
