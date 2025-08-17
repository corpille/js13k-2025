import { gravity } from './config';
import Level from './level';
import PlayerEntity from './entities/PlayerEntity';
import EndEntity from './entities/EndEntity';

export default class Game {
  currentLevel: number;
  level: Level;
  end: EndEntity;
  player: PlayerEntity;
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
    this.level = new Level(startX, startY, b, m ?? [], end);
    this.player = new PlayerEntity(this.level.startX, this.level.startY, 2, 2);
    this.jumpForce = 0;
    this.xForce = 0;
    this.yForce = 0;
    this.keys = {};
    this.isJumping = false;
    this.gravityForce = gravity;
  }
}
