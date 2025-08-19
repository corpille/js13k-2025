import BlocEntity from './entities/BlocEntity';
import EndEntity from './entities/EndEntity';
import Entity from './entities/Entity';
import TreatEntity from './entities/TreatEntity';
import { isCollidingWith } from './utils';

export default class Level {
  name: string;
  mirrored: boolean;
  blocks: BlocEntity[];
  end: EndEntity;
  treat: TreatEntity;
  foundTreat: boolean = false;
  alreadyFoundTreat: boolean = false;

  constructor(
    name: string,
    blocks: any[],
    mirrored: boolean,
    alreadyFoundTreat: boolean = false,
    treat?: number[],
    end?: number[],
  ) {
    this.name = name;
    this.mirrored = mirrored;
    this.alreadyFoundTreat = alreadyFoundTreat;
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

  checkTreatGathering(player: Entity) {
    if (this.treat && !this.foundTreat) {
      const hasTreat = isCollidingWith(player, this.treat);
      if (hasTreat) {
        this.treat.gathered = true;
        this.foundTreat = true;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.blocks.forEach((block) => {
      block.render(ctx);
    });
    if (this.treat) {
      ctx.save();
      if (this.alreadyFoundTreat) {
        ctx.filter = 'opacity(0.3)';
      }
      this.treat.render(ctx);
      ctx.restore();
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
