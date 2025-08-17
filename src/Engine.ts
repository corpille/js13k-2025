import { forceDecrease, FPS, gravity, gridHeight, gridWidth, jumpSpeed, moveSpeed, squareSize } from './config';
import { canvas, end } from './elements';
import EndEntity from './entities/EndEntity';
import Game from './Game';
import { isCollidingWith, querySelector } from './utils';

export default class Engine {
  game: Game;
  levels: any[];
  jumpDebuff: boolean = false;

  // Time Handling
  interval: number = Math.floor(1000 / FPS);
  startTime: number = performance.now();
  previousTime: number = this.startTime;
  currentTime: number = 0;
  deltaTime: number = 0;

  private ctx: CanvasRenderingContext2D;

  constructor(levels: any[]) {
    this.levels = levels;
    this.game = new Game(levels);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  processInput() {
    if (!this.game.keys['Space']) {
      this.jumpDebuff = false;
    }
    if ((this.game.keys['KeyA'] || this.game.keys['ArrowLeft']) && this.game.player.x > 0) {
      this.game.xForce = -moveSpeed;
      this.game.player.isLeft = true;
    }
    if ((this.game.keys['KeyD'] || this.game.keys['ArrowRight']) && this.game.player.x < (gridWidth - 1) * squareSize) {
      this.game.xForce = moveSpeed;
      this.game.player.isLeft = false;
    }
    if (this.game.keys['Space'] && this.game.player.isGrounded && !this.jumpDebuff) {
      this.game.jumpForce = jumpSpeed;
      this.jumpDebuff = true;
      this.game.level.blocks.forEach((block, index) => index !== 0 && (block.isDark = !block.isDark));
      this.game.level.end.isDark = !this.game.level.end.isDark;
    }
  }

  changeState() {
    // Update Blocks
    this.game.level.blocks.forEach((block) => block.update());

    // Compute Y force
    this.game.yForce += this.game.gravityForce - this.game.jumpForce;
    const colision = this.game.level.blocks.find((block) => {
      return isCollidingWith({ ...this.game.player.hitBox, y: this.game.player.hitBox.y + this.game.yForce }, block);
    });

    // Move player
    let yOffset = 0;
    let xOffset = 0;
    if (colision) {
      xOffset = colision.movingShift / 2;
      if (this.game.player.hitBox.y > colision.y) {
        this.game.player.hitBox.y = colision.y + this.game.player.hitBox.height;
      } else {
        this.game.player.y = colision.y - this.game.player.height;
        this.game.player.hitBox.y = colision.y - this.game.player.hitBox.height;
        this.game.player.isGrounded = true;
        this.game.player.landStart();
        this.game.gravityForce = gravity;
      }
    } else {
      yOffset += this.game.yForce;
      this.game.player.isGrounded = false;
      if (this.game.yForce > 0) {
        this.game.player.fallStart();
      } else {
        this.game.player.jumpStart();
      }
      this.game.gravityForce += 0.1;
    }

    const Xcolision = this.game.level.blocks.find((block) => {
      return isCollidingWith({ ...this.game.player.hitBox, x: this.game.player.hitBox.x + this.game.xForce }, block);
    });
    if (!Xcolision) {
      xOffset += this.game.xForce;
      if (this.game.xForce) {
        this.game.player.runStart();
      } else if (this.game.player.isRunning) {
        this.game.player.runStop();
      }
    }
    this.game.player.update(xOffset, yOffset);

    // Reset forces
    this.game.xForce =
      this.game.xForce < 0
        ? Math.min(0, this.game.xForce + forceDecrease)
        : Math.max(0, this.game.xForce - forceDecrease);
    this.game.jumpForce = Math.max(0, this.game.jumpForce - forceDecrease);
    this.game.yForce = 0;
  }

  render() {
    this.ctx.clearRect(0, 0, gridWidth * squareSize, gridHeight * squareSize);
    this.game.level.blocks.forEach((block) => {
      block.render(this.ctx);
    });
    this.game.level.end.render(this.ctx);
    this.game.player.render(this.ctx);
  }

  checkEndState() {
    if (isCollidingWith(this.game.player, this.game.level.end)) {
      this.validateLvl();
      if (this.game.currentLevel === this.levels.length) {
        this.endGame();
      } else {
        this.game.reset(this.levels);
      }
    } else if (this.game.player.y > (gridHeight + 2) * squareSize) {
      this.game.reset(this.levels);
    }
  }

  validateLvl() {
    querySelector(`.lvl:nth-child(${this.game.currentLevel + 1})`).className = 'lvl done';
    this.game.currentLevel++;
    querySelector(`.lvl:nth-child(${this.game.currentLevel + 1})`)?.classList.add('doing');
  }

  endGame() {
    end.style.top = `${canvas.getBoundingClientRect().top}px`;
    this.game.stop = true;
  }

  loop(timestamp: any) {
    if (this.game.stop) {
      return;
    }
    this.processInput();
    this.currentTime = timestamp;
    this.deltaTime = this.currentTime - this.previousTime;

    if (this.deltaTime > this.interval) {
      this.previousTime = this.currentTime - (this.deltaTime % this.interval);

      this.changeState();
      this.render();
      this.checkEndState();
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}
