import GameEntity from './GameEntity';

export default class BlocEntity extends GameEntity {
  isDark: boolean;

  constructor(x: number, y: number, width: number, height: number, isDark: boolean) {
    super(x, y, width, height);
    this.isDark = isDark;
  }
}
