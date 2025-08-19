import { treatImage } from '../assets';
import { gridRealHeight, squareSize } from '../config';
import Entity from './Entity';

const animationSpeed = 6;

export default class TreatEntity extends Entity {
  gathered: boolean = false;
  frameCounter: number = 0;
  offsetShift: number = 0;
  moveDown: boolean = true;

  constructor(x: number, y: number) {
    super(x, y, 1, 1);
  }
  render(ctx: CanvasRenderingContext2D) {
    if (this.gathered) {
      return;
    }

    this.frameCounter++;
    if (this.frameCounter > animationSpeed) {
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
      gridRealHeight - this.y - this.height + this.offsetShift,
      this.width,
      this.height,
    );
  }
}
