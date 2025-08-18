import { gravity, gridHeight, gridRealHeight, gridRealWidth } from './config';
import Level from './level';
import PlayerEntity from './entities/PlayerEntity';
import EndEntity from './entities/EndEntity';
import { isCollidingWith } from './utils';
import Entity from './entities/Entity';

export default class Game {
  currentLevel: number;
  end: EndEntity;
  level: Level;
  mirrorLevel: Level;
  player: PlayerEntity;
  mirroredPlayer: PlayerEntity;
  hasMirror: boolean = false;
  jumpForce: number = 0;
  xForce: number = 0;
  yForce: number = 0;
  gravityForce: number = gravity;
  isJumping: boolean = false;
  keys: { [name: string]: boolean } = {};
  stop: boolean = false;

  constructor(levels: any[]) {
    this.currentLevel = 0;
    this.reset(levels);
  }

  reset(levels: any[]) {
    const { startX, startY, b, m, end } = levels[this.currentLevel];
    this.level = new Level(b, end);
    this.mirrorLevel = new Level(m ?? [], undefined, true);
    this.hasMirror = !!this.mirrorLevel.blocks.length;
    this.player = new PlayerEntity(startX, startY, 2, 2);
    this.player = new PlayerEntity(startX, startY, 2, 2);
    this.jumpForce = 0;
    this.xForce = 0;
    this.yForce = 0;
    this.keys = {};
    this.isJumping = false;
    this.gravityForce = gravity;
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
