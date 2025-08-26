import {
  darkBackground,
  getDefaultRadius,
  getGridRealHeight,
  getGridRealWidth,
  introLocalStorageKey,
  leveltLocalStorageKey,
  lightBackground,
  getSquareSize,
  treatLocalStorageKey,
  worlds,
} from './config';
import Level from './level';
import PlayerEntity from './entities/PlayerEntity';
import EndEntity from './entities/EndEntity';
import { isCollidingWith } from './utils';
import { UiScene } from './ui-elements/Scene';
import {
  endSym,
  gameSym,
  getScenesList,
  pauseSym,
  startLoreSym,
  startSym,
  world1TransitionSym,
  world2TransitionSym,
} from './scenes';
import { treatCounter } from './scenes/gameScene';
import { treatEndCounter } from './scenes/endScenes';
import AudioEngine from './AudioEngine';

export default class Game {
  static _instance: Game;
  _currentLvl: number;
  started: boolean = false;
  paused: boolean;
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
    treatEndCounter.text = `${this.treatCount}/${worlds.flat().length}`;
  }

  static get instance(): Game {
    if (!Game._instance) {
      Game._instance = new Game();
      Game._instance.scenes = getScenesList();
      Game._instance.loadScene(startSym);
    }
    return Game._instance;
  }

  get hasSeenIntro(): boolean {
    return localStorage.getItem(introLocalStorageKey) === 'true' ? true : false;
  }

  set hasSeenIntro(value: boolean) {
    localStorage.setItem(introLocalStorageKey, value.toString());
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
    treatEndCounter.text = `${this.treatCount}/${worlds.flat().length}`;
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
    treatEndCounter.text = `${this.treatCount}/${worlds.flat().length}`;
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
    this.paused = false;
    this.started = true;
    this._currentLvl = lvl;
    if (!this.hasSeenIntro) {
      this.loadScene(startLoreSym);
      this.hasSeenIntro = true;
    } else {
      this.loadScene(gameSym);
    }
    this.levels.forEach((level, i) => {
      level.reset(this.treatsFound.includes(i));
    });
    this.mirrorLevels.forEach((mirrorLevel, i) => {
      mirrorLevel.reset(this.treatsFound.includes(i));
    });
    this.reset();
  }

  reset() {
    this.paused = false;
    this.currentLevel.reset(this.treatsFound.includes(this.currentLvl));
    this.currentMirrorLevel.reset(this.treatsFound.includes(this.currentLvl));
    this.player = new PlayerEntity(this.currentLevel.startX, this.currentLevel.startY);
    this.jumpForce = 0;
    this.xForce = 0;
    this.keys = {};
    this.isJumping = false;
    this.gravityForce = 0;
    this.radius = getDefaultRadius();
  }

  loadScene(name: symbol) {
    if (name === gameSym) {
      if (!AudioEngine.instance.isPlaying) {
        AudioEngine.instance.playBgMusic();
      } else {
        AudioEngine.instance.resume();
      }
    } else {
      AudioEngine.instance.pause();
    }
    this.scenes[this.currentScene].unload();
    this.currentScene = name;
    this.scenes[this.currentScene].load();
  }

  validateLvl() {
    let levelCounter = 0;
    const currentWorld = worlds.findIndex((w, i) => {
      levelCounter += w.length;
      if (this.currentLvl + 1 === levelCounter) {
        return true;
      }
      return false;
    });
    if (currentWorld !== -1) {
      this.loadScene(currentWorld === 0 ? world1TransitionSym : world2TransitionSym);
    } else {
      this.currentLvl++;
      this.reset();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw animation circle
    ctx.save();
    const hitBox = this.player.getHitbox();
    ctx.fillStyle = darkBackground;
    ctx.fillRect(0, 0, getGridRealWidth(), getGridRealHeight());

    ctx.beginPath();
    ctx.arc(
      hitBox.x + hitBox.height / 2,
      getGridRealHeight() - hitBox.y - hitBox.height * 1.25 + Math.max(0, this.radius) / 2,
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
    ctx.fillRect(0, 0, getGridRealWidth(), getGridRealHeight());
    ctx.closePath();
    ctx.restore();

    if (!this.hasMirror) {
      this.currentLevel.render(ctx);
      this.player.render(ctx);
    } else {
      // Draw mirror
      ctx.save();

      ctx.filter = 'contrast(.7)';
      ctx.translate(0, getGridRealHeight() * 1.5);
      ctx.scale(1, -1);

      ctx.beginPath();
      ctx.fillStyle = 'rgba(65, 188, 226, 0.2)';
      ctx.rect(0, 0, getGridRealWidth(), getGridRealHeight());
      ctx.fill();
      ctx.closePath();

      this.currentMirrorLevel.render(ctx);
      this.player.render(ctx);
      ctx.restore();

      // Draw real
      ctx.save();

      ctx.translate(0, Math.round(-getGridRealHeight() / 2));

      this.currentLevel.render(ctx);
      this.player.render(ctx, false);

      ctx.beginPath();
      ctx.fillStyle = '#c5cfdb';
      ctx.rect(0, getGridRealHeight(), getGridRealWidth(), 1);
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    }
  }

  renderUI(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
    if (this.scenes[this.currentScene].needRefresh) {
      this.scenes[this.currentScene].render(ctx);
    }
  }

  invertLevel() {
    this.currentLevel.invert();
    this.currentMirrorLevel.invert();
  }

  checkColission(entity: { x: number; y: number; width: number; height: number }) {
    return [...this.currentLevel.blocks, ...this.currentMirrorLevel.blocks].filter((block) =>
      isCollidingWith(entity, block),
    );
  }

  pause(playScene: boolean = true) {
    if (!this.started) return;
    this.player.paused = true;
    this.paused = true;
    if (playScene) {
      this.loadScene(pauseSym);
    }
  }

  unPause() {
    this.player.paused = false;
    this.paused = false;
    this.loadScene(gameSym);
  }

  endGame() {
    this.radius = getSquareSize() * 1.5;
    this.paused = true;
    setTimeout(() => {
      this.stop = true;
      this.loadScene(endSym);
    }, 50);
  }
}
