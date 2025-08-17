import { gridHeight, gridRealHeight } from './config';
import BlocEntity from './entities/BlocEntity';
import EndEntity from './entities/EndEntity';
import Entity from './entities/Entity';

export default class Level {
  mirrored: boolean;
  blocks: BlocEntity[];
  end: EndEntity;

  constructor(blocks: any[], end?: number[], mirrored?: boolean) {
    this.mirrored = mirrored ?? false;
    this.blocks = blocks.map(
      ([x, y, width, height, isDark, moveRange]) => new BlocEntity(x, y, width, height, isDark, moveRange),
    );
    if (end) {
      this.end = new EndEntity(end[0], end[1], this.blocks[this.blocks.length - 1].isDark);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.blocks.forEach((block) => {
      block.render(ctx);
    });
    if (this.end) {
      this.end.render(ctx);
    }
  }

  invert() {
    this.blocks.forEach((block, index) => index !== 0 && (block.isDark = !block.isDark));
    if (this.end) {
      this.end.isDark = !this.end.isDark;
    }
  }
}
