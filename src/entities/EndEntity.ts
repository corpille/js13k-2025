import { cardBoardImage } from '../assets';
import { gridRealHeight } from '../config';
import Entity from './Entity';

export default class EndEntity extends Entity {
  isDark: boolean;

  constructor(x: number, y: number, isDark: boolean) {
    super(x, y, 2, 2);

    this.isDark = isDark;
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    if (!this.isDark) {
      ctx.filter = 'invert(1) opacity(0.4)';
    }
    ctx.fillStyle = '#292d5c';
    ctx.drawImage(cardBoardImage, this.x, gridRealHeight - this.y - this.height, this.width, this.height);
    ctx.restore();
  }
}
