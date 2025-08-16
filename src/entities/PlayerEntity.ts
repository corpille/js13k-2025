import { animationSpeed, squareSize } from '../config';
import Entity from './Entity';

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
  animationCallback: Function | null;

  animations: { [name: symbol]: number[] } = {
    [idleSym]: [0, 7],
    [runSym]: [8, 12],
    [jumpSym]: [13, 17],
    [fallSym]: [18, 19],
    [landSym]: [20, 21],
  };

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width * 2, height * 2);

    this.image = new Image(20, 20 * 21);
    this.image.src = '../assets/cat.webp';
    this.frameCounter = 0;
    this.currentAnimation = idleSym;
    this.currentFrame = this.animations[this.currentAnimation][0];
    this.loopAnimation = true;
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
      this.currentAnimation = landSym;
      this.resetAnimationFrame();
      this.loopAnimation = false;
      this.animationCallback = () => {
        this.currentAnimation = idleSym;
        this.resetAnimationFrame();
        this.loopAnimation = true;
      };
    }
  }

  resetAnimationFrame() {
    this.currentFrame = this.animations[this.currentAnimation][0];
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
    this.frameCounter++;
    if (this.frameCounter === animationSpeed) {
      this.frameCounter = 0;
      if (this.currentFrame + 1 >= this.animations[this.currentAnimation][1]) {
        if (this.loopAnimation) {
          this.resetAnimationFrame();
        }
        if (this.animationCallback) {
          this.animationCallback();
          this.animationCallback = null;
        }
      } else {
        this.currentFrame++;
      }
    }

    ctx.save();
    if (this.isLeft) {
      ctx.translate(this.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(
      this.image,
      this.currentFrame * frameWidth,
      0,
      frameWidth,
      frameHeight,
      this.x * (this.isLeft ? -1 : 1),
      this.y,
      this.width,
      this.height,
    );
    ctx.restore();
  }
}
