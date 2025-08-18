import { FPS, gridHeight, gridRealHeight, squareSize } from '../config';
import Entity from './Entity';

const moveSpeed = 5;
export default class BlocEntity extends Entity {
  isDark: boolean;
  startX: number;
  moveRangeX: number = 0;
  movingShiftX: number = 0;
  currentMoveShiftX: number = 0;
  movingRight: boolean = true;

  moveRangeY: number = 0;
  movingShiftY: number = 0;
  movingTop: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    isDark: boolean,
    moveRangeX: number = 0,
    moveRangeY: number = 0,
  ) {
    super(x, y, width, height);
    this.startX = this.x;
    this.isDark = isDark;
    this.moveRangeY = Math.abs((moveRangeY ?? 0) * squareSize);
    this.moveRangeX = Math.abs((moveRangeX ?? 0) * squareSize);
    this.movingRight = moveRangeX > 0;
    this.movingTop = moveRangeY > 0;
    this.movingShiftX = 0;
    this.movingShiftY = 0;
  }

  update() {
    if (this.moveRangeX !== 0) {
      if (this.movingShiftX >= this.moveRangeX) {
        this.movingShiftX = 0;
        this.movingRight = !this.movingRight;
      }
      this.movingShiftX += moveSpeed;
      this.currentMoveShiftX = (this.movingRight ? 1 : -1) * moveSpeed;
      this.x += this.currentMoveShiftX;
    }
    if (this.moveRangeY !== 0) {
      if (this.movingShiftY >= this.moveRangeY) {
        this.movingShiftY = 0;
        this.movingTop = !this.movingTop;
      }
      this.movingShiftY += moveSpeed;
      this.y += (this.movingTop ? 1 : -1) * moveSpeed;
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
