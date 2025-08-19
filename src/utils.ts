import BlocEntity from './entities/BlocEntity';
import Entity from './entities/Entity';
import { textImage } from './assets';

const textHeight = 5;
const magnifiying = 4;
const textWidth = 3;

export const querySelector = (selector: string) => document.querySelector(selector) as HTMLElement;

export function isCollidingWith(a: Entity, b: Entity) {
  return (
    (!(b instanceof BlocEntity) || (b instanceof BlocEntity && b.isDark)) &&
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function isPointCollission(p: { x: number; y: number }, r: Entity) {
  return (
    p.x >= r.x && // right of the left edge AND
    p.x <= r.x + r.width && // left of the right edge AND
    p.y >= r.y && // below the top AND
    p.y <= r.y + r.height
  );
}

export function displayNumber(ctx: CanvasRenderingContext2D, x: number, y: number, nb: number) {
  String(nb)
    .split('')
    .forEach((c, i) => {
      ctx.drawImage(
        textImage,
        parseInt(c) * textWidth,
        0,
        textWidth,
        textHeight,
        x + i * (textWidth + 1) * magnifiying,
        y,
        textWidth * magnifiying,
        textHeight * magnifiying,
      );
    });
  return textWidth;
}

export function displayDash(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.drawImage(
    textImage,
    10 * textWidth,
    0,
    textWidth,
    textHeight,
    x,
    y,
    textWidth * magnifiying,
    textHeight * magnifiying,
  );
  return textWidth;
}

export function displayHashtag(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.drawImage(textImage, 11 * textWidth, 0, 5, textHeight, x, y, 5 * magnifiying, textHeight * magnifiying);
  return 5;
}

export function displayString(ctx: CanvasRenderingContext2D, x: number, y: number, str: string) {
  let offset = 0;
  str.split('').forEach((c, i) => {
    if (c === '#') {
      offset += displayHashtag(ctx, x + offset * magnifiying, y);
    } else if (c === '-') {
      offset += displayDash(ctx, x + offset * magnifiying, y);
    } else {
      offset += displayNumber(ctx, x + offset * magnifiying, y, parseInt(c));
    }
    offset += 1; // spacing
  });
}
