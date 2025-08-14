import BlocEntity from './BlocEntity';
import GameEntity from './GameEntity';

export default class Level {
  startX: number;
  startY: number;
  blocks: BlocEntity[];
  end: GameEntity;

  constructor(startX: number, startY: number, blocks: any[], end: number[]) {
    this.startX = startX;
    this.startY = startY;
    this.blocks = blocks.map(([x, y, width, height, isDark]) => new BlocEntity(x, y, width, height, isDark));
    this.end = new GameEntity(end[0], end[1], 1, 2);
  }
}
