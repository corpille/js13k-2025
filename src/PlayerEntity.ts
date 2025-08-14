import GameEntity from './GameEntity';

export default class PlayerEntity extends GameEntity {
  isGrounded: boolean = false;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
}
