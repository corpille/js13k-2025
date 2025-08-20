import { canvas } from './elements';
import BlocEntity from './entities/BlocEntity';
import Entity from './entities/Entity';

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

export function getCursorPosition(event: any) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}
