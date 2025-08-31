import { getGridRealHeight, getGridRealWidth, lightBackground } from './config';
import { canvas } from './elements';
import Game from './Game';
import { randomBetween } from './utils';

export let backgrounds: HTMLImageElement[] = [];
export let backgroundShift = 4;

const colors: string[] = [
  '#061527', // 0
  '#1a1b1f', // 1
  '#333c66', // 2
  '#8c7586', // 3
  '#ca9a88', // 4
  '#e9c0b1ff', // 5
  '#5197cb', // 6
  '#e8f1f0', // 7
  '#fde4dbff', // 8
];
const levels = [
  [0, 0, 1], // 1-1
  [0, 0, 1, 1, 2], // 1-2
  [0, 1, 1, 2, 3], // 1-3
  [0, 1, 2, 2, 3, 4], // 1-4
  [0, 1, 2, 3, 4, 5], // 1-5
  [2, 3, 4, 5], // 2-1
  [2, 3, 4, 5, 8], // 2-2
  [3, 4, 5], // 2-3
  [7, 8, 5], //2-4
  [6, 7, 8], // 2-5
  [6, 7], // 3-1
  [6, 7], // 3-2
  [6, 7], // 3-3
  [6, 7], // 3-4
  [6, 7], // 3-5
];

const stars: [number, number][] = [];
for (let i = 0; i < 400; i++) {
  stars.push([randomBetween(0, getGridRealWidth()), randomBetween(0, getGridRealHeight())]);
}

function drawStars(ctx: CanvasRenderingContext2D) {
  ctx.save();

  stars.forEach(([x, y]) => {
    ctx.fillStyle = '#ffffff';
    ctx.rect(x, y, 1, 1);
    ctx.fill();
  });
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, lvl: number) {
  const gradientColors: [number, string][] = levels[lvl].map((color, i) => [
    (1 / levels[lvl].length) * i,
    colors[color],
  ]);
  const fillStyle = ctx.createLinearGradient(getGridRealWidth() / 2, 0, getGridRealWidth() / 2, getGridRealHeight());
  gradientColors.forEach(([offset, color]) => {
    (fillStyle as CanvasGradient).addColorStop(offset, color);
  });
  // Draw background
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, getGridRealWidth(), getGridRealHeight());
  ctx.closePath();
  if (lvl <= 7) {
    drawStars(ctx);
  }
  ctx.restore();
}

export function computeBackgrounds() {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const bg: HTMLImageElement[] = [];
  levels.forEach((l, i) => {
    drawBackground(ctx, i);
    const image = new Image();
    image.src = canvas.toDataURL('image/png');
    bg.push(image);
    ctx.clearRect(0, 0, getGridRealWidth(), getGridRealHeight());
  });
  backgrounds = bg;
}
