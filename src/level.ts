import { gridHeight, gridRealHeight } from './config';
import BlocEntity from './entities/BlocEntity';
import EndEntity from './entities/EndEntity';
import Entity from './entities/Entity';
import TreatEntity from './entities/TreatEntity';

export default class Level {
  mirrored: boolean;
  blocks: BlocEntity[];
  end: EndEntity;
  treat: TreatEntity;

  constructor(blocks: any[], treat?: number[], end?: number[], mirrored?: boolean) {
    this.mirrored = mirrored ?? false;
    this.blocks = blocks.map(
      ([x, y, width, height, isDark, moveRangeX, moveRangeY]) =>
        new BlocEntity(x, y, width, height, isDark, moveRangeX, moveRangeY),
    );
    if (treat) {
      this.treat = new TreatEntity(treat[0], treat[1]);
    }
    if (end) {
      this.end = new EndEntity(end[0], end[1], this.blocks[this.blocks.length - 1].isDark);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.blocks.forEach((block) => {
      block.render(ctx);
    });
    if (this.treat) {
      this.treat.render(ctx);
    }
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
