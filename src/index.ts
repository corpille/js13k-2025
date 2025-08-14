import BlocEntity from './BlocEntity';
import { gridHeight, gridWidth, squareSize } from './config';
import GameEntity from './GameEntity';
import Level from './level';
import PlayerEntity from './PlayerEntity';

// Game constant
const moveSpeed = 4;
const jumpSpeed = 16;
const gravity = 5;
const forceDecrease = 1;

// Level Data
const levelData = {
  startX: 1,
  startY: 18,
  b: [
    [0, 19, 6, 1, true],
    [9, 16, 6, 1, false],
    [18, 14, 2, 1, true],
    [13, 11, 3, 1, false],
    [6, 9, 4, 1, true],
    [2, 7, 2, 1, false],
    [6, 5, 3, 1, true],
    [11, 3, 13, 1, false],
    [30, 14, 7, 1, true],
  ],
  end: [34, 12],
};

let level = new Level(levelData.startX, levelData.startY, levelData.b, levelData.end);
let player = new PlayerEntity(level.startX, level.startY, 1, 1);
let jumpForce = 0;
let xForce = 0;
let yForce = 0;
let gravityForce = gravity;
let isJumping = false;
let keys: { [name: string]: boolean } = {};

let ctx: CanvasRenderingContext2D;

function render() {
  ctx.clearRect(0, 0, gridWidth * squareSize, gridHeight * squareSize);
  level.blocks.forEach((block) => {
    ctx.fillStyle = block.isDark ? 'black' : '#D3D3D3';
    ctx.fillRect(block.x, block.y, block.width, block.height);
  });
  ctx.fillStyle = 'red';
  ctx.fillRect(level.end.x, level.end.y, squareSize, squareSize * 2);

  ctx.fillStyle = 'green';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function isCollidingWith(a: GameEntity, b: GameEntity) {
  return (
    (!(b instanceof BlocEntity) || (b instanceof BlocEntity && b.isDark)) &&
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function processInput() {
  if (!keys['Space']) {
    isJumping = false;
  }
  if ((keys['KeyA'] || keys['ArrowLeft']) && player.x > 0) {
    xForce = -moveSpeed;
  }
  if ((keys['KeyD'] || keys['ArrowRight']) && player.x < (gridWidth - 1) * squareSize) {
    xForce = moveSpeed;
  }
  if (keys['Space'] && player.isGrounded && !isJumping) {
    jumpForce = jumpSpeed;
    isJumping = true;
    level.blocks.forEach((block, index) => index !== 0 && (block.isDark = !block.isDark));
  }
}

function reset() {
  level = new Level(levelData.startX, levelData.startY, levelData.b, levelData.end);
  player = new PlayerEntity(level.startX, level.startY, 1, 1);
  jumpForce = 0;
  xForce = 0;
  yForce = 0;
  keys = {};
}

function changeState() {
  // Compute Y force
  yForce += gravityForce - jumpForce;
  const colision = level.blocks.find((block) => {
    return isCollidingWith({ x: player.x, y: player.y + yForce, width: player.width, height: player.height }, block);
  });

  // Move player
  if (colision) {
    if (colision.y * squareSize < player.y + squareSize) {
      player.y = colision.y + squareSize;
    } else {
      player.y = colision.y - squareSize;
      player.isGrounded = true;
      gravityForce = gravity;
    }
  } else {
    player.y += yForce;
    player.isGrounded = false;
    gravityForce += 0.1;
  }
  player.x += xForce;

  // Reset forces
  xForce = xForce < 0 ? Math.min(0, xForce + forceDecrease) : Math.max(0, xForce - forceDecrease);
  yForce = 0;
  jumpForce = Math.max(0, jumpForce - forceDecrease);
  if (isCollidingWith(player, level.end)) {
    alert('GG WP');
    reset();
  }
  if (player.y > (gridHeight + 1) * squareSize) {
    reset();
  }
}

function gameLoop() {
  processInput();
  changeState();
  render();

  window.requestAnimationFrame(gameLoop);
}

function init() {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;

  canvas.height = squareSize * gridHeight;
  canvas.width = squareSize * gridWidth;
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  window.addEventListener('keydown', function (e) {
    keys[e.code] = true;
  });

  window.addEventListener('keyup', function (e) {
    keys[e.code] = false;
  });

  window.requestAnimationFrame(gameLoop);
}

init();
