import {
  coyoteFrames,
  defaultRadius,
  forceDecrease,
  FPS,
  gravity,
  gridHeight,
  gridWidth,
  jumpSpeed,
  moveSpeed,
  squareSize,
} from './config';
import { canvas } from './elements';
import Game from './Game';
import { checkColissions } from './physics';
import { isCollidingWith } from './utils';

export default class Engine {
  game: Game;
  levels: any[];
  jumpDebuff: boolean = false;
  jumpFrame: number = 0;

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
    if (this.game.keys['KeyA'] || this.game.keys['ArrowLeft']) {
      this.game.xForce = -moveSpeed;
      this.game.player.isLeft = true;
    }
    if (this.game.keys['KeyD'] || this.game.keys['ArrowRight']) {
      this.game.xForce = moveSpeed;
      this.game.player.isLeft = false;
    }
    if (this.game.keys['Space'] && this.game.player.isGrounded && !this.jumpDebuff) {
      this.game.jumpForce = jumpSpeed;
      this.jumpDebuff = true;
      this.game.invertLevel();
    }
  }

  changeState() {
    // Treat Handling
    this.game.level.checkTreatGathering(this.game.player.hitBox);
    this.game.mirrorLevel.checkTreatGathering(this.game.player.hitBox);

    if (this.game.level.foundTreat && !this.game.level.alreadyFoundTreat) {
      this.game.updateTreat(this.game.treatCount + 1);
      this.game.level.alreadyFoundTreat = true;
    }
    if (this.game.mirrorLevel.foundTreat && !this.game.mirrorLevel.alreadyFoundTreat) {
      this.game.updateTreat(this.game.treatCount + 1);
      this.game.mirrorLevel.alreadyFoundTreat = true;
    }

    // Update Blocks
    this.game.level.blocks.forEach((block) => block.update());

    // Compute Y force
    this.game.yForce = this.game.gravityForce + this.game.jumpForce;

    // Move player
    let yOffset = 0;
    let xOffset = 0;

    const colisions = checkColissions(this.game);

    if ((!colisions.bottom && this.game.yForce < 0) || (!colisions.top && this.game.yForce > 0)) {
      const isCoyoting = this.game.player.isGrounded && this.game.yForce < 0;
      if (isCoyoting) {
        this.jumpFrame++;
      } else {
        this.jumpFrame = 0;
      }
      if (!isCoyoting || (isCoyoting && this.jumpFrame > coyoteFrames)) {
        yOffset += this.game.yForce;
        if (this.game.yForce < 0) {
          this.game.player.fallStart();
        } else if (this.game.yForce > 0 && this.game.player.isGrounded) {
          this.game.player.jumpStart();
        }
        this.game.player.isGrounded = false;
        this.game.gravityForce -= 0.15;
      }
    } else {
      if (colisions.bottom) {
        const block = colisions.bottom.block;
        xOffset += block.currentMoveShiftX;
        this.game.player.hitBox.y = block.y + block.height;
        if (!this.game.player.isGrounded) {
          this.game.player.landStart();
        }
        this.game.player.isGrounded = true;
        this.game.gravityForce = gravity;
      }

      if (colisions.top) {
        this.game.player.hitBox.y = colisions.top.block.y - this.game.player.hitBox.height;
        this.game.player.fallStart();
        this.game.jumpForce = 0;
      }
    }

    if ((!colisions.right && this.game.xForce > 0) || (!colisions.left && this.game.xForce < 0)) {
      xOffset += this.game.xForce;
      if (this.game.xForce) {
        this.game.player.runStart();
      }
    } else {
      if (colisions.right) {
        this.game.player.hitBox.x = colisions.right.block.x - this.game.player.hitBox.width;
      }

      if (colisions.left) {
        this.game.player.hitBox.x = colisions.left.block.x + colisions.left.block.width;
      }
      if (this.game.xForce === 0 && this.game.player.isRunning) {
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
  }

  render() {
    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, gridWidth * squareSize, gridHeight * squareSize);
    this.game.render(this.ctx);
    this.ctx.restore();
  }

  renderUI(inverted: boolean = false) {
    this.ctx.save();
    this.game.renderUI(this.ctx);
    this.ctx.restore();
  }

  playTransition(callback: Function) {
    const unZoom = () => {
      if (this.game.radius < defaultRadius) {
        this.game.radius += 22;
        setTimeout(unZoom.bind(this));
      }
    };
    const zoom = () => {
      if (this.game.radius >= 0) {
        this.game.radius -= 24;
        setTimeout(zoom.bind(this));
      } else {
        if (callback()) {
          this.game.radius = 0;
          setTimeout(unZoom, 100);
        }
      }
    };
    zoom();
  }

  checkEndState() {
    if (this.game.level.end.isDark && isCollidingWith(this.game.player.hitBox, this.game.level.end)) {
      this.game.player.runStop();
      this.game.pause = true;
      this.playTransition(() => {
        this.game.validateLvl();
        this.jumpFrame = 0;
        if (this.game.currentLevel === this.levels.length) {
          this.endGame();
          return false;
        }
        this.game.reset(this.levels, true);
        return true;
      });
    } else if (this.game.player.hitBox.y < -this.game.player.hitBox.height * 2) {
      this.jumpFrame = 0;
      this.game.reset(this.levels);
    }
  }

  endGame() {
    this.game.loadScene('end');
    this.game.radius = squareSize * 1.5;
    this.game.pause = true;
    setTimeout(() => {
      this.game.stop = true;
    }, 50);
  }

  loop(timestamp: any) {
    this.processInput();
    this.currentTime = timestamp;
    this.deltaTime = this.currentTime - this.previousTime;

    if (this.deltaTime > this.interval) {
      this.previousTime = this.currentTime - (this.deltaTime % this.interval);

      if (!this.game.stop) {
        if (!this.game.pause) {
          this.changeState();
        }
        if (this.game.started) {
          this.render();
        }

        if (!this.game.pause) {
          this.checkEndState();
        }
      }
      this.renderUI();
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}
