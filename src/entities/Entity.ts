import { squareSize } from '../config';

export default class Entity {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x * squareSize;
    this.y = y * squareSize;
    this.width = width * squareSize;
    this.height = height * squareSize;
  }
}
