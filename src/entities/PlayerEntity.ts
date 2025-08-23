import { catImage, catImageHeight, catImageWidth } from '../assets';
import { getGridRealHeight, getGridRealWidth, getSquareSize, gridWidth } from '../config';
import { Box, Coord } from '../utils';
import Entity from './Entity';

const idleSym = Symbol('idle');
const runSym = Symbol('run');
const jumpSym = Symbol('jump');
const fallSym = Symbol('fall');
const landSym = Symbol('land');

export default class PlayerEntity extends Entity {
  isGrounded: boolean = false;
  isRunning: boolean = false;
  isJumping: boolean = false;
  isLeft: boolean = false;
  currentFrame: number;
  currentAnimation: symbol = idleSym;
  frameCounter: number;
  loopAnimation: boolean;
  backToIdle: boolean;
  hitBox: Entity;
  offsets: Coord = { x: 0, y: 0 };

  animations: { [name: symbol]: number[] } = {
    [idleSym]: [0, 7],
    [runSym]: [8, 12],
    [jumpSym]: [14, 16],
    [fallSym]: [17, 19],
    [landSym]: [19, 20],
  };

  set x(value: number) {
    this._x = value;
  }

  get x(): number {
    const dx = (this._width / 4) * (this.isLeft ? 1 : -1);

    return (this._x + dx) * getSquareSize() + this.offsets.x;
  }

  set y(value: number) {
    this._y = value;
  }

  get y(): number {
    return this._y * getSquareSize() + this.offsets.y;
  }

  getHitbox(): Box {
    return {
      x: this.x - this.hitBox.x * (this.isLeft ? 1 : -1),
      y: this.y - this.hitBox.y,
      width: this.hitBox.width,
      height: this.hitBox.height,
    };
  }

  constructor(x: number, y: number) {
    super(x, y, 2, 2);

    this.frameCounter = 0;
    this.currentAnimation = idleSym;
    this.currentFrame = this.animations[this.currentAnimation][0];
    this.loopAnimation = true;
    this.hitBox = new Entity(0.5, 0, 1, 1);
  }

  runStart() {
    if (!this.isRunning && !this.isJumping && this.currentAnimation !== fallSym) {
      this.currentAnimation = runSym;
      this.resetAnimationFrame();
    }
    this.isRunning = true;
  }

  runStop() {
    if (this.isRunning && this.currentAnimation !== fallSym) {
      this.currentAnimation = idleSym;
      this.resetAnimationFrame();
    }
    this.isRunning = false;
  }

  jumpStart() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.currentAnimation = jumpSym;
      this.resetAnimationFrame();
      this.loopAnimation = false;
    }
  }

  fallStart() {
    if (this.currentAnimation !== fallSym) {
      this.currentAnimation = fallSym;
      this.resetAnimationFrame();
      this.loopAnimation = false;
      this.backToIdle = false;
    }
  }

  landStart() {
    if (this.currentAnimation === fallSym) {
      this.isJumping = false;
      this.currentAnimation = landSym;
      this.resetAnimationFrame();
      this.loopAnimation = this.isRunning;
      this.backToIdle = true;
    }
  }

  resetAnimationFrame() {
    this.currentFrame = this.animations[this.currentAnimation][0];
  }

  update(x: number = 0, y: number = 0) {
    if (x) {
      const { x: hX, width } = this.getHitbox();
      if (hX + x + width <= getGridRealWidth() && hX + x >= 0) {
        this.offsets.x += x;
      }
    }
    if (y) {
      this.offsets.y += y;
    }
  }

  render(ctx: CanvasRenderingContext2D, noAnimation: boolean = true) {
    if (noAnimation) {
      this.frameCounter++;
      const [start, end] = this.animations[this.currentAnimation];
      if (this.frameCounter > end - start) {
        this.frameCounter = 0;
        if (this.currentFrame + 1 === end + 1) {
          if (this.loopAnimation) {
            this.resetAnimationFrame();
          }
          if (this.backToIdle) {
            this.currentAnimation = this.isRunning ? runSym : idleSym;
            this.resetAnimationFrame();
            this.loopAnimation = true;
            this.backToIdle = false;
          }
        } else {
          this.currentFrame++;
        }
      }
    }

    ctx.save();
    if (this.isLeft) {
      ctx.translate(this.width / 2, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(
      catImage,
      this.currentFrame * catImageWidth,
      0,
      catImageWidth,
      catImageHeight,
      this.x * (this.isLeft ? -1 : 1),
      getGridRealHeight() - this.y - this.height,
      this.width,
      this.height,
    );

    ctx.restore();
  }
}
