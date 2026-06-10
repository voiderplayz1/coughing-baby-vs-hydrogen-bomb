const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  WORLD.init(canvas);
  Player.init(canvas);
}

window.addEventListener('resize', resize);
resize();

const keys = {};

window.addEventListener('keydown', e => {
  keys[e.code] = true;
});

window.addEventListener('keyup', e => {
  keys[e.code] = false;
});

let lastTime = null;

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;

  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  Player.update(dt, keys, canvas);

  WORLD.draw(ctx, canvas);
  Player.draw(ctx);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
