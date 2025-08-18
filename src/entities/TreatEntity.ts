import { gridRealHeight, squareSize } from '../config';
import Entity from './Entity';
import door from '/assets/door.webp';

export default class TreatEntity extends Entity {
  image: HTMLImageElement;
  gathered: boolean = false;

  constructor(x: number, y: number) {
    super(x, y, 1, 1);
  }
  render(ctx: CanvasRenderingContext2D) {
    if (this.gathered) {
      return;
    }
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.roundRect(
      this.x + squareSize / 4,
      gridRealHeight - (this.y + this.height - squareSize / 4),
      this.width - squareSize / 2,
      this.height - squareSize / 2,
      4,
    );
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
