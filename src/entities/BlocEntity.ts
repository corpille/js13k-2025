import { FPS, squareSize } from '../config';
import Entity from './Entity';

const moveSpeed = 1;
export default class BlocEntity extends Entity {
  isDark: boolean;
  startX: number;
  moveRange: number;
  frameCounter: number = 0;
  currentOffset: number = 0;
  movingRight: boolean = true;
  movingShift: number = 0;

  constructor(x: number, y: number, width: number, height: number, isDark: boolean, moveRange: number) {
    super(x, y, width, height);
    this.startX = this.x;
    this.isDark = isDark;
    this.moveRange = (moveRange ?? 0) * squareSize;
  }

  update() {
    if (this.moveRange !== 0) {
      this.frameCounter++;
      if (this.frameCounter > moveSpeed) {
        console.log(this.startX);
        this.frameCounter = 0;
        if (this.movingRight && this.x + this.movingShift > this.startX + this.moveRange) {
          this.movingRight = false;
        } else if (!this.movingRight && this.x + this.movingShift <= this.startX) {
          this.movingRight = true;
        }
        this.movingShift = (this.movingRight ? 1 : -1) * 10;
        this.x += this.movingShift;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isDark ? 'black' : '#D3D3D3';
    ctx.strokeStyle = '#B8B8B8';
    ctx.lineWidth = 3;

    ctx.setLineDash([5]);

    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 4);
    if (!this.isDark) {
      ctx.stroke();
    }
    ctx.fill();
  }
}
