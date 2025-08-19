import { gravity, gridHeight, gridRealHeight, gridRealWidth, squareSize } from './config';
import Level from './level';
import PlayerEntity from './entities/PlayerEntity';
import EndEntity from './entities/EndEntity';
import { isCollidingWith } from './utils';
import Entity from './entities/Entity';
import text from '../assets/text.png';

export default class Game {
  currentLevel: number;
  end: EndEntity;
  level: Level;
  mirrorLevel: Level;
  player: PlayerEntity;
  mirroredPlayer: PlayerEntity;
  hasMirror: boolean = false;
  jumpForce: number;
  xForce: number;
  yForce: number;
  gravityForce: number;
  isJumping: boolean = false;
  keys: { [name: string]: boolean } = {};
  stop: boolean = false;
  treatCount: number;
  image: HTMLImageElement;

  constructor(levels: any[]) {
    this.currentLevel = 0;
    this.treatCount = 0;
    this.reset(levels);
  }

  reset(levels: any[], changeLevel: boolean = false) {
    const { startX, startY, b, m, end, treat, mirrorTreat } = levels[this.currentLevel];
    this.level = new Level(b, false, this.level?.alreadyFoundTreat && !changeLevel, treat, end);
    this.mirrorLevel = new Level(m ?? [], true, this.mirrorLevel?.alreadyFoundTreat && !changeLevel, mirrorTreat);
    this.hasMirror = !!this.mirrorLevel.blocks.length;
    this.player = new PlayerEntity(startX, startY, 2, 2);
    this.player = new PlayerEntity(startX, startY, 2, 2);
    this.jumpForce = 0;
    this.xForce = 0;
    this.keys = {};
    this.isJumping = false;
    this.gravityForce = gravity;

    this.image = new Image(20, 21 * 20);
    this.image.src = text;
  }

  validateLvl() {
    this.currentLevel++;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.hasMirror) {
      this.level.render(ctx);
      this.player.render(ctx);
    } else {
      // Draw mirror
      ctx.save();

      ctx.filter = 'contrast(.7)';
      ctx.translate(0, gridRealHeight * 1.5);
      ctx.scale(1, -1);

      ctx.beginPath();
      ctx.fillStyle = 'rgba(65, 188, 226, 0.2)';
      ctx.rect(0, 0, gridRealWidth, gridRealHeight);
      ctx.fill();
      ctx.closePath();

      this.mirrorLevel.render(ctx);
      this.player.render(ctx);
      ctx.restore();

      // Draw real
      ctx.save();

      ctx.translate(0, -gridRealHeight / 2);

      this.level.render(ctx);
      this.player.render(ctx);

      ctx.beginPath();
      ctx.fillStyle = '#c5cfdb';
      ctx.rect(0, gridRealHeight, gridRealWidth, 1);
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    }
  }

  renderUI(ctx: CanvasRenderingContext2D) {
    ctx.save();
    // Draw treat
    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.roundRect(16, 16, 20, 20, 4);
    ctx.fill();
    ctx.closePath();

    //Draw treat number
    const textWidth = 3;
    const textHeight = 5;
    const magnifiying = 4;
    String(this.treatCount)
      .split('')
      .forEach((c, i) => {
        ctx.drawImage(
          this.image,
          parseInt(c) * textWidth,
          0,
          textWidth,
          textHeight,
          48 + i * (textWidth + 1) * magnifiying,
          16,
          textWidth * magnifiying,
          textHeight * magnifiying,
        );
      });
    ctx.restore();
  }

  invertLevel() {
    this.level.invert();
    this.mirrorLevel.invert();
  }

  checkColission(entity: Entity) {
    return [...this.level.blocks, ...this.mirrorLevel.blocks].filter((block) => {
      return isCollidingWith(entity, block);
    });
  }
}
