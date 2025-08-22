import {
  darkBackground,
  defaultRadius,
  gravity,
  gridRealHeight,
  gridRealWidth,
  levels,
  leveltLocalStorageKey,
  lightBackground,
  squareSize,
  treatLocalStorageKey,
} from './config';
import Level from './level';
import PlayerEntity from './entities/PlayerEntity';
import EndEntity from './entities/EndEntity';
import { isCollidingWith } from './utils';
import Entity from './entities/Entity';
import { UiScene } from './ui-elements/Scene';
import {
  endScene,
  endSym,
  gameScene,
  gameSym,
  getLevelScene,
  getStartScene,
  levelSym,
  startSym,
  treatCounter,
  treatEndCounter,
} from './scenes';

export default class Game {
  static _instance: Game;
  _currentLvl: number;
  started: boolean = false;
  pause: boolean;
  stop: boolean = false;
  end: EndEntity;
  level: Level;
  player: PlayerEntity;
  jumpForce: number;
  xForce: number;
  yForce: number;
  gravityForce: number;
  isJumping: boolean = false;
  keys: { [name: string]: boolean } = {};
  radius: number;
  scenes: { [name: symbol]: UiScene } = {};
  currentScene: symbol = startSym;
  levels: Level[] = [];
  mirrorLevels: Level[] = [];

  constructor() {
    treatCounter.text = `${this.treatCount}`;
    treatEndCounter.text = `${this.treatCount}/${levels.length}`;
  }

  public static get instance(): Game {
    if (!Game._instance) {
      Game._instance = new Game();
      Game._instance.scenes = {
        [startSym]: getStartScene(),
        [gameSym]: gameScene,
        [endSym]: endScene,
        [levelSym]: getLevelScene(),
      };
      Game._instance.loadScene(startSym);
    }
    return Game._instance;
  }

  get currentLevel(): Level {
    return this.levels[this.currentLvl];
  }
  get currentMirrorLevel(): Level {
    return this.mirrorLevels[this.currentLvl];
  }
  get hasMirror(): boolean {
    return !!this.currentMirrorLevel?.blocks.length;
  }

  get treatsFound(): number[] {
    return JSON.parse(localStorage.getItem(treatLocalStorageKey) ?? '[]');
  }

  set treatFound(value: number[]) {
    localStorage.setItem(treatLocalStorageKey, JSON.stringify(value));
    treatCounter.text = `${this.treatCount}`;
    treatEndCounter.text = `${this.treatCount}/${levels.length}`;
  }

  get currentLvl(): number {
    if (this._currentLvl === undefined) {
      this._currentLvl = parseInt(localStorage.getItem(leveltLocalStorageKey) ?? '0');
    }
    return this._currentLvl;
  }

  set currentLvl(value: number) {
    if (value > this.currentLvl) {
      localStorage.setItem(leveltLocalStorageKey, value.toString());
    }
    this._currentLvl = value;
    treatCounter.text = `${this.treatCount}`;
    treatEndCounter.text = `${this.treatCount}/${levels.length}`;
  }

  get treatCount(): number {
    return this.treatsFound.length;
  }

  loadLevels(levels: any[]) {
    this.levels = [];
    this.mirrorLevels = [];
    levels.forEach(({ name, startX, startY, b, m, end, treat, mirrorTreat }, i) => {
      this.levels.push(new Level(name, startX, startY, b, false, this.treatsFound.indexOf(i) !== -1, treat, end));
      this.mirrorLevels.push(
        new Level(name, startX, startY, m ?? [], true, this.treatsFound.indexOf(i) !== -1, mirrorTreat),
      );
    });
    this.reset();
  }

  addTreat() {
    this.treatFound = [...this.treatsFound, this.currentLvl];
  }

  restart(lvl: number = 0) {
    this.stop = false;
    this.pause = false;
    this.started = true;
    this._currentLvl = lvl;
    this.loadScene(gameSym);
    this.levels.forEach((level) => {
      level.reset();
    });
    this.mirrorLevels.forEach((mirrorLevel) => {
      mirrorLevel.reset();
    });
    this.reset();
  }

  reset() {
    this.pause = false;
    this.currentLevel.reset();
    this.currentMirrorLevel.reset();
    this.player = new PlayerEntity(this.currentLevel.startX, this.currentLevel.startY, 2, 2);
    this.jumpForce = 0;
    this.xForce = 0;
    this.keys = {};
    this.isJumping = false;
    this.gravityForce = gravity;
    this.radius = defaultRadius;
  }

  loadScene(name: symbol) {
    this.scenes[this.currentScene].unload();
    this.currentScene = name;
    this.scenes[this.currentScene].load();
  }

  validateLvl() {
    this.currentLvl++;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw animation circle
    ctx.save();
    console.log('render');
    ctx.fillStyle = darkBackground;
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
    ctx.fillStyle = lightBackground;
    ctx.fillRect(0, 0, gridRealWidth, gridRealHeight);
    ctx.closePath();
    ctx.restore();

    if (!this.hasMirror) {
      this.currentLevel.render(ctx);
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

      this.currentMirrorLevel.render(ctx);
      this.player.render(ctx);
      ctx.restore();

      // Draw real
      ctx.save();

      ctx.translate(0, -gridRealHeight / 2);

      this.currentLevel.render(ctx);
      this.player.render(ctx, false);

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
    if (this.scenes[this.currentScene].needRefresh) {
      console.log('render ui');
      this.scenes[this.currentScene].render(ctx);
    }
  }

  invertLevel() {
    this.currentLevel.invert();
    this.currentMirrorLevel.invert();
  }

  checkColission(entity: Entity) {
    return [...this.currentLevel.blocks, ...this.currentMirrorLevel.blocks].filter((block) => {
      return isCollidingWith(entity, block);
    });
  }

  pauseGame() {
    this.player.runStop();
    this.pause = true;
  }

  endGame() {
    this.radius = squareSize * 1.5;
    this.pause = true;
    setTimeout(() => {
      this.stop = true;
      this.loadScene(endSym);
    }, 50);
  }
}
