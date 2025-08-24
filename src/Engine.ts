import {
  coyoteFrames,
  getDefaultRadius,
  getForceDecrease,
  FPS,
  getGridRealHeight,
  getGridRealWidth,
  getJumpSpeed,
  getSquareSize,
  getMoveSpeed,
  worlds,
} from './config';
import { canvas } from './elements';
import Game from './Game';
import { checkColissions } from './physics';
import { isCollidingWith } from './utils';

export default class Engine {
  game: Game;
  jumpDebuff: boolean = false;
  jumpFrame: number = 0;

  // Time Handling
  interval: number = Math.floor(1000 / FPS);
  startTime: number = performance.now();
  previousTime: number = this.startTime;
  currentTime: number = 0;
  deltaTime: number = 0;

  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.game = Game.instance;
    this.game.loadLevels(worlds.flat());
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  processInput() {
    if (!this.game.keys['Space']) {
      this.jumpDebuff = false;
    }
    if (this.game.keys['KeyA'] || this.game.keys['ArrowLeft']) {
      this.game.xForce = -getMoveSpeed();
      this.game.player.isLeft = true;
    }
    if (this.game.keys['KeyD'] || this.game.keys['ArrowRight']) {
      this.game.xForce = getMoveSpeed();
      this.game.player.isLeft = false;
    }
    if (this.game.keys['Space'] && this.game.player.isGrounded && !this.jumpDebuff) {
      this.game.jumpForce = getJumpSpeed();
      this.jumpDebuff = true;
      this.game.invertLevel();
    }
  }

  getGravityForce() {
    return -getSquareSize() / 4 - this.game.gravityForce;
  }

  changeState() {
    const hitBox = this.game.player.getHitbox();
    // Treat Handling
    if (
      this.game.currentLevel.checkTreatGathering(hitBox) ||
      this.game.currentMirrorLevel.checkTreatGathering(hitBox)
    ) {
      this.game.addTreat();
    }

    // Update Blocks
    this.game.currentLevel.blocks.forEach((block) => block.update());

    // Compute Y force
    this.game.yForce = this.getGravityForce() + this.game.jumpForce;

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
          yOffset = 0;
          this.game.player.jumpStart();
        }
        this.game.player.isGrounded = false;
        this.game.gravityForce += getSquareSize() / 152;
      }
    } else {
      if (colisions.bottom) {
        const block = colisions.bottom.block;
        xOffset += block.currentMoveShiftX;
        this.game.player.offsets.y += block.y + block.height - hitBox.y;
        if (!this.game.player.isGrounded) {
          this.game.player.landStart();
        }
        this.game.player.isGrounded = true;
        this.game.gravityForce = 0;
      }

      if (colisions.top) {
        const block = colisions.top.block;
        this.game.player.offsets.y += hitBox.y + hitBox.height - block.y;
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
        this.game.player.offsets.x += colisions.right.block.x - (hitBox.x + hitBox.width);
      }

      if (colisions.left) {
        this.game.player.offsets.x += colisions.left.block.x + colisions.left.block.width - hitBox.x;
      }
      if (this.game.xForce === 0 && this.game.player.isRunning) {
        this.game.player.runStop();
      }
    }
    this.game.player.update(xOffset, yOffset);

    // Reset forces
    this.game.xForce =
      this.game.xForce < 0
        ? Math.min(0, this.game.xForce + getForceDecrease())
        : Math.max(0, this.game.xForce - getForceDecrease());
    this.game.jumpForce = Math.max(0, this.game.jumpForce - getForceDecrease());
  }

  render() {
    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, getGridRealWidth(), getGridRealHeight());
    this.game.render(this.ctx);
    this.ctx.restore();
  }

  renderUI() {
    this.ctx.save();
    this.game.renderUI(this.ctx);
    this.ctx.restore();
  }

  playTransition(callback: Function) {
    const unZoom = () => {
      if (this.game.radius < getDefaultRadius()) {
        this.game.radius += getSquareSize() / 1.72;
        setTimeout(unZoom.bind(this));
      }
    };
    const zoom = () => {
      if (this.game.radius >= 0) {
        this.game.radius -= getSquareSize() / 1.58;
        setTimeout(zoom.bind(this));
      } else {
        if (callback()) {
          this.game.radius = 0;
          setTimeout(unZoom, 300);
        }
      }
    };
    zoom();
  }

  checkEndState() {
    const hitBox = this.game.player.getHitbox();
    if (this.game.currentLevel.end.isDark && isCollidingWith(hitBox, this.game.currentLevel.end)) {
      this.game.pauseGame();
      this.playTransition(() => {
        this.jumpFrame = 0;
        if (this.game.currentLvl + 1 === this.game.levels.length) {
          this.game.endGame();
        } else {
          this.game.validateLvl();
        }
      });
    } else if (hitBox.y < -hitBox.height * 2) {
      this.jumpFrame = 0;
      this.game.reset();
    }
  }

  loop(timestamp: any) {
    this.processInput();
    this.currentTime = timestamp;
    this.deltaTime = this.currentTime - this.previousTime;

    if (this.deltaTime > this.interval) {
      this.previousTime = this.currentTime - (this.deltaTime % this.interval);

      if (this.game.started && !this.game.stop) {
        if (!this.game.pause) {
          this.changeState();
        }
        if (this.game.started) {
          this.render();
        }

        if (!this.game.pause) {
          this.checkEndState();
        }
        // this.game.started = false;
      }
      this.renderUI();
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}
