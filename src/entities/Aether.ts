import { FPS, getGridRealWidth, getSquareSize } from '../config';
import PlayerEntity, { runSym } from './PlayerEntity';

const pauseTime = FPS * 1.5;
export class Aether extends PlayerEntity {
  counter: number = 0;

  constructor(x: number = 0, y: number = 1, isStartLeft: boolean = false) {
    super(x, y, !isStartLeft);
    this.width = 1.8;
    this.height = 1.8;
    this.isRunning = true;
    this.catSet = 1;
  }

  update(x: number = 0) {
    if (this.counter < pauseTime) {
      this.counter++;
      if (this.counter === pauseTime) {
        this.currentAnimation = runSym;
        this.resetAnimationFrame();
        this.isLeft = !this.isLeft;
      }
    } else if (this.offsets.x < getGridRealWidth() && this.x + this.width > 0) {
      this.offsets.x += x * (this.isLeft ? -1 : 1);
    }
  }
}
