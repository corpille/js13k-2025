import { gridRealHeight, gridRealWidth } from '../config';

export class UiElement {
  x: number;
  y: number;
  text: string;
  size: number;
  height: number;
  width: number;
  onClick: Function = () => {};
  hovered: boolean;

  constructor(x: number, y: number, text: string, size: number, centered: boolean[] = [false, false]) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.size = size;
    const buttonRealSize = this.getRealSize();
    this.height = buttonRealSize.height;
    this.width = buttonRealSize.width;
    if (centered[0]) {
      this.x = Math.round((gridRealWidth - this.width) / 2);
    }
    if (centered[1]) {
      this.y = Math.round((gridRealHeight - this.height) / 2);
    }
  }

  getRealSize() {
    return {
      width: 0,
      height: 0,
    };
  }
}
