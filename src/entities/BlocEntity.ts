import { darkBackground, getGridRealHeight, getSquareSize } from '../config';
import { Coord } from '../utils';
import Entity from './Entity';

const getBlockMoveSpeed = () => Math.round(getSquareSize() / 8);
export default class BlocEntity extends Entity {
  initialIsDark: boolean;
  isDark: boolean;
  startX: number;
  _moveRangeX: number = 0;
  _moveRangeY: number = 0;
  currentMoveShiftX: number = 0;
  movingRight: boolean = true;

  movingTop: boolean = false;
  offsets: Coord = { x: 0, y: 0 };

  set x(value: number) {
    this._x = value;
  }

  get x(): number {
    return this._x * getSquareSize() + this.offsets.x;
  }

  set y(value: number) {
    this._y = value;
  }

  get y(): number {
    return this._y * getSquareSize() + this.offsets.y;
  }

  set moveRangeX(value: number) {
    this._moveRangeX = value;
  }

  get moveRangeX() {
    return (this._moveRangeX ?? 0) * getSquareSize();
  }

  set moveRangeY(value: number) {
    this._moveRangeY = value;
  }

  get moveRangeY() {
    return (this._moveRangeY ?? 0) * getSquareSize();
  }

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
    this.moveRangeY = moveRangeY;
    this.moveRangeX = moveRangeX;
    this.movingRight = moveRangeX > 0;
    this.movingTop = moveRangeY > 0;
  }

  reset() {
    this.isDark = this.initialIsDark;
  }

  update() {
    if (this.moveRangeX !== 0) {
      if (
        (this.moveRangeX > 0 && (this.offsets.x < 0 || this.offsets.x >= this.moveRangeX)) ||
        (this.moveRangeX < 0 && (this.offsets.x > 0 || this.offsets.x <= this.moveRangeX))
      ) {
        this.movingRight = !this.movingRight;
      }
      this.currentMoveShiftX = (this.movingRight ? 1 : -1) * getBlockMoveSpeed();
      this.offsets.x += this.currentMoveShiftX;
    }
    if (this.moveRangeY !== 0) {
      if (
        (this.moveRangeY > 0 && (this.offsets.y < 0 || this.offsets.y >= this.moveRangeY)) ||
        (this.moveRangeY < 0 && (this.offsets.y > 0 || this.offsets.y <= this.moveRangeY))
      ) {
        this.movingTop = !this.movingTop;
      }
      this.offsets.y += (this.movingTop ? 1 : -1) * getBlockMoveSpeed();
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
    const y = getGridRealHeight() - this.y - this.height;
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
