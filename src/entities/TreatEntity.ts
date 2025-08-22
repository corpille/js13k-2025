import { treatImage } from '../assets';
import { gridRealHeight, squareSize } from '../config';
import Entity from './Entity';

export default class TreatEntity extends Entity {
  frameCounter: number = 0;
  offsetShift: number = 0;
  moveDown: boolean = true;

  constructor(x: number, y: number) {
    super(x, y, 0.5, 0.5);
  }
  render(ctx: CanvasRenderingContext2D) {
    this.frameCounter++;
    if (this.frameCounter > 6) {
      this.frameCounter = 0;
      this.offsetShift += this.moveDown ? 1 : -1;
      if (this.offsetShift === 3) {
        this.moveDown = false;
      } else if (this.offsetShift === -3) {
        this.moveDown = true;
      }
    }
    ctx.drawImage(
      treatImage,
      this.x,
      gridRealHeight - this.y - this.height * 1.5 + this.offsetShift,
      this.width,
      this.height,
    );
  }
}
