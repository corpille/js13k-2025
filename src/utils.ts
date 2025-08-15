import BlocEntity from './BlocEntity';
import GameEntity from './GameEntity';

export const querySelector = (selector: string) => document.querySelector(selector) as HTMLElement;

export function isCollidingWith(a: GameEntity, b: GameEntity) {
  return (
    (!(b instanceof BlocEntity) || (b instanceof BlocEntity && b.isDark)) &&
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
