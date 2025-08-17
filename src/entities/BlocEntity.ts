import { FPS, gridHeight, gridRealHeight, squareSize } from '../config';
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
    ctx.save();
    ctx.fillStyle = this.isDark ? '#282828' : 'rgba(0, 0, 0, 0.05)';
    ctx.strokeStyle = this.isDark ? 'black' : 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;

    if (!this.isDark) {
      ctx.setLineDash([5]);
    }

    ctx.beginPath();
    let corners: number | number[] = 4;
    if (this.y === 0) {
      corners = [4, 4, 0, 0];
    }
    const y = gridRealHeight - this.y - this.height;
    ctx.roundRect(this.x, y, this.width, this.height, corners);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    if (this.y === 0) {
      ctx.strokeStyle = this.isDark ? '#282828' : '#dbd8c5';
      ctx.setLineDash([0]);
      ctx.beginPath();
      ctx.moveTo(this.x, y + this.height);
      ctx.lineTo(this.x + this.width, y + this.height);
      ctx.stroke();
      ctx.closePath();
    }
    ctx.restore();
  }
}
