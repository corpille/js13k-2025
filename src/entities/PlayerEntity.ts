import { animationSpeed, squareSize } from '../config';
import Entity from './Entity';

let frameWidth = 20;
let frameHeight = 20;

export default class PlayerEntity extends Entity {
  isGrounded: boolean = false;
  isRunning: boolean = false;
  isJumping: boolean = false;
  isLeft: boolean = false;
  image: HTMLImageElement;
  currentFrame: number;
  currentAnimation: string = 'idle';
  frameCounter: number;
  loopAnimation: boolean;
  animationCallback: Function | null;

  animations: { [name: string]: number[] } = {
    idle: [0, 7],
    run: [8, 12],
    jump: [13, 17],
    fall: [18, 19],
    land: [20, 21],
  };

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width * 2, height * 2);

    this.image = new Image(20, 20 * 21);
    this.image.src = '../assets/cat.png';
    this.frameCounter = 0;
    this.currentAnimation = 'idle';
    this.currentFrame = this.animations[this.currentAnimation][0];
    this.loopAnimation = true;
  }

  runStart() {
    if (!this.isRunning && !this.isJumping) {
      this.isRunning = true;
      this.currentAnimation = 'run';
      this.resetAnimationFrame();
    }
  }

  runStop() {
    if (this.isRunning) {
      this.isRunning = false;
      this.currentAnimation = 'idle';
      this.resetAnimationFrame();
    }
  }

  jumpStart() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.currentAnimation = 'jump';
      this.resetAnimationFrame();
      this.loopAnimation = false;
    }
  }

  fallStart() {
    if (this.currentAnimation !== 'fall') {
      this.currentAnimation = 'fall';
      this.resetAnimationFrame();
      this.loopAnimation = false;
    }
  }

  landStart() {
    if (this.isJumping) {
      this.isJumping = false;
      this.currentAnimation = 'land';
      this.resetAnimationFrame();
      this.loopAnimation = false;
      this.animationCallback = () => {
        this.currentAnimation = 'idle';
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
      this.currentFrame++;
      if (this.currentFrame >= this.animations[this.currentAnimation][1]) {
        if (this.loopAnimation) {
          this.resetAnimationFrame();
        } else if (this.animationCallback) {
          this.animationCallback();
          this.animationCallback = null;
        }
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
