import { defaultRadius, gravity, gridRealHeight, gridRealWidth, squareSize } from './config';
import Level from './level';
import PlayerEntity from './entities/PlayerEntity';
import EndEntity from './entities/EndEntity';
import { isCollidingWith } from './utils';
import Entity from './entities/Entity';
import { treatImage } from './assets';
import { displayString } from './ui';
import { UiScene } from './ui-elements/Scene';
import { endScene, gameScene, startButton, startScene, treatCounter, treatEndCounter } from './scenes';

export default class Game {
  started: boolean = false;
  pause: boolean;
  stop: boolean = false;
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
  treatCount: number;
  radius: number;
  scenes: { [name: string]: UiScene } = {};
  currentScene: string = 'start';

  constructor(levels: any[]) {
    this.currentLevel = 0;
    this.updateTreat(0);
    startButton.onClick = () => {
      this.started = true;
      this.loadScene('game');
    };
    this.scenes = {
      start: startScene,
      game: gameScene,
      end: endScene,
    };
    this.scenes.start.load();
    this.reset(levels);
  }

  updateTreat(count: number) {
    this.treatCount = count;
    treatCounter.text = `${count}`;
    treatEndCounter.text = `${count}`;
  }

  reset(levels: any[], changeLevel: boolean = false) {
    this.pause = false;
    const { name, startX, startY, b, m, end, treat, mirrorTreat } = levels[this.currentLevel];
    this.level = new Level(name, b, false, this.level?.alreadyFoundTreat && !changeLevel, treat, end);
    this.mirrorLevel = new Level(name, m ?? [], true, this.mirrorLevel?.alreadyFoundTreat && !changeLevel, mirrorTreat);
    this.hasMirror = !!this.mirrorLevel.blocks.length;
    this.player = new PlayerEntity(startX, startY, 2, 2);
    this.player = new PlayerEntity(startX, startY, 2, 2);
    this.jumpForce = 0;
    this.xForce = 0;
    this.keys = {};
    this.isJumping = false;
    this.gravityForce = gravity;
    this.radius = defaultRadius;
  }

  loadScene(name: string) {
    this.scenes[this.currentScene].unload();
    this.currentScene = name;
    this.scenes[this.currentScene].load();
  }

  validateLvl() {
    this.currentLevel++;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw animation circle
    ctx.save();
    ctx.fillStyle = '#1d1d21';
    ctx.fillRect(0, 0, gridRealWidth, gridRealHeight);

    ctx.beginPath();
    ctx.arc(
      this.player.hitBox.x + this.player.hitBox.height / 2,
      gridRealHeight - this.player.hitBox.y - this.player.hitBox.height * 1.25 + Math.max(0, this.radius) / 2,
      Math.max(0, this.radius),
      0,
      Math.PI * 2,
      true,
    );
    ctx.restore();
    ctx.clip();

    // Draw background
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#F4F0DB';
    ctx.fillRect(0, 0, gridRealWidth, gridRealHeight);
    ctx.closePath();
    ctx.restore();

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
    ctx.imageSmoothingEnabled = false;
    this.scenes[this.currentScene].render(ctx);
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
