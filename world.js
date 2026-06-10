const WORLD = {
  skyTop: '#87CEEB',
  skyBottom: '#dff0ff',

  platform: {
    x: 0,
    y: 0,
    width: 0,
    height: 40,
    color: '#888888',
  },

  draw(ctx, canvas) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, this.skyTop);
    gradient.addColorStop(1, this.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = this.platform.color;
    ctx.fillRect(
      this.platform.x,
      this.platform.y,
      this.platform.width,
      this.platform.height
    );
  },

  init(canvas) {
    this.platform.width = canvas.width;
    this.platform.y = canvas.height - 80;
    this.platform.x = 0;
  },

  getFloorY() {
    return this.platform.y;
  }
};
