import { animationSpeed, gridRealHeight, gridRealWidth, squareSize } from '../config';
import Entity from './Entity';
import cat from '/assets/cat.webp';

let frameWidth = 20;
let frameHeight = 20;

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
  image: HTMLImageElement;
  currentFrame: number;
  currentAnimation: symbol = idleSym;
  frameCounter: number;
  loopAnimation: boolean;
  backToIdle: boolean;
  hitBox: Entity;

  animations: { [name: symbol]: number[] } = {
    [idleSym]: [0, 7],
    [runSym]: [8, 12],
    [jumpSym]: [14, 16],
    [fallSym]: [17, 19],
    [landSym]: [19, 20],
  };

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);

    this.image = new Image(20, 21 * 20);
    this.image.src = cat;
    this.frameCounter = 0;
    this.currentAnimation = idleSym;
    this.currentFrame = this.animations[this.currentAnimation][0];
    this.loopAnimation = true;
    this.hitBox = new Entity(x + 0.5, y, width - 1, height - 1);
  }

  runStart() {
    if (!this.isRunning && !this.isJumping) {
      this.isRunning = true;
      this.currentAnimation = runSym;
      this.resetAnimationFrame();
    }
  }

  runStop() {
    if (this.isRunning) {
      this.isRunning = false;
      this.currentAnimation = idleSym;
      this.resetAnimationFrame();
    }
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
    }
  }

  landStart() {
    if (this.currentAnimation === fallSym) {
      this.isJumping = false;
      this.currentAnimation = this.isRunning ? runSym : landSym;
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
      this.hitBox.x += x;
      if (this.hitBox.x < 0) {
        this.hitBox.x = 0;
      } else if (this.hitBox.x + this.hitBox.width > gridRealWidth) {
        this.hitBox.x = gridRealWidth - this.hitBox.width;
      }
    }
    if (y) {
      this.hitBox.y += y;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
    this.frameCounter++;
    if (this.frameCounter > animationSpeed) {
      this.frameCounter = 0;
      if (this.currentFrame + 1 === this.animations[this.currentAnimation][1] + 1) {
        if (this.loopAnimation) {
          this.resetAnimationFrame();
        } else if (this.backToIdle) {
          this.currentAnimation = idleSym;
          this.resetAnimationFrame();
          this.loopAnimation = true;
          this.backToIdle = false;
        }
      } else {
        this.currentFrame++;
      }
    }

    ctx.save();
    if (this.isLeft) {
      ctx.translate(this.width / 2, 0);
      ctx.scale(-1, 1);
    }

    const dx = (squareSize / 2) * (this.isLeft ? 1 : -1);

    ctx.drawImage(
      this.image,
      this.currentFrame * frameWidth,
      0,
      frameWidth,
      frameHeight,
      (this.hitBox.x + dx) * (this.isLeft ? -1 : 1),
      gridRealHeight - this.hitBox.y - this.height,
      this.width,
      this.height,
    );

    // DEBUG
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(
    //   this.hitBox.x * (this.isLeft ? -1 : 1),
    //   gridRealHeight - this.hitBox.y - this.hitBox.height,
    //   this.hitBox.width,
    //   this.hitBox.height,
    // );
    ctx.restore();
  }
}
