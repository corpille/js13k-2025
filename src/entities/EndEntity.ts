import { gridRealHeight } from '../config';
import Entity from './Entity';
import endImage from '/assets/cardboard.webp';

export default class EndEntity extends Entity {
  image: HTMLImageElement;
  isDark: boolean;

  constructor(x: number, y: number, isDark: boolean) {
    super(x, y, 2, 2);

    this.isDark = isDark;
    this.image = new Image(40, 40);
    this.image.src = endImage;
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    if (!this.isDark) {
      ctx.filter = 'invert(1) opacity(0.4)';
    }
    ctx.fillStyle = '#292d5c';
    ctx.drawImage(this.image, this.x, gridRealHeight - this.y - this.height, this.width, this.height);
    ctx.restore();
  }
}
