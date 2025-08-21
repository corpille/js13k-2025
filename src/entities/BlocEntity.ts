import { darkBackground, FPS, gridHeight, gridRealHeight, squareSize } from '../config';
import Entity from './Entity';

const moveSpeed = 5;
export default class BlocEntity extends Entity {
  initialIsDark: boolean;
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
    this.initialIsDark = isDark;
    this.moveRangeY = Math.abs((moveRangeY ?? 0) * squareSize);
    this.moveRangeX = Math.abs((moveRangeX ?? 0) * squareSize);
    this.movingRight = moveRangeX > 0;
    this.movingTop = moveRangeY > 0;
    this.movingShiftX = 0;
    this.movingShiftY = 0;
  }

  reset() {
    this.isDark = this.initialIsDark;
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
    ctx.beginPath();
    ctx.fillStyle = this.isDark ? darkBackground : `${darkBackground}05`;
    ctx.strokeStyle = this.isDark ? 'black' : `${darkBackground}20`;
    ctx.lineWidth = 2;

    if (!this.isDark) {
      ctx.setLineDash([5]);
    }

    let corners: number | number[] = 4;
    if (this.y === 0) {
      corners = [4, 4, 0, 0];
    }
    const y = gridRealHeight - this.y - this.height;
    ctx.roundRect(this.x, y, this.width, this.height, corners);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    if (this.y === 0) {
      ctx.strokeStyle = this.isDark ? darkBackground : '#f3f2ec';
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
