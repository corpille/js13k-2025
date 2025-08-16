import BlocEntity from './entities/BlocEntity';
import Entity from './entities/Entity';

export default class Level {
  startX: number;
  startY: number;
  blocks: BlocEntity[];
  end: Entity;

  constructor(startX: number, startY: number, blocks: any[], end: number[]) {
    this.startX = startX;
    this.startY = startY;
    this.blocks = blocks.map(([x, y, width, height, isDark]) => new BlocEntity(x, y, width, height, isDark));
    this.end = new Entity(end[0], end[1], 1, 2);
  }
}
