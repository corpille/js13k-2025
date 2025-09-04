import { getGridRealWidth, getSquareSize } from '../config';
import PlayerEntity, { runSym } from './PlayerEntity';

export class Aether extends PlayerEntity {
  constructor(x: number = 0, y: number = 1, isStartLeft: boolean = false) {
    super(x, y, isStartLeft);
    this.width = 1.8;
    this.height = 1.8;
    this.isRunning = true;
    this.currentAnimation = runSym;
    this.currentFrame = this.animations[this.currentAnimation][0];
  }

  update(x: number = 0, y: number = 0) {
    if (this.offsets.x < getGridRealWidth()) {
      this.offsets.x += x * (this.isLeft ? -1 : 1);
    }
    this.offsets.y += y;
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.filter = 'invert(1)  hue-rotate(-45deg)';
    super.render(ctx);
    ctx.restore();
  }
}
