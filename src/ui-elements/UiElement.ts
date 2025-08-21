import { gridRealHeight, gridRealWidth } from '../config';
import { UiScene } from './Scene';

export class UiElement {
  x: number;
  y: number;
  size: number;
  height: number;
  width: number;
  onClick: Function = () => {};
  hovered: boolean;
  parent: UiElement | UiScene;
  loaded: boolean = false;
  centered: boolean[];
  inverted: number = -1;

  constructor(x: number, y: number, size: number, centered: boolean[] = [false, false]) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.centered = centered;
  }

  setParent(parent: UiElement | UiScene) {
    this.parent = parent;
    this.centerElement();
  }

  centerElement() {
    const parenSize = this.parent?.getRealSize() ?? { width: gridRealWidth, height: gridRealHeight };
    const buttonRealSize = this.getRealSize();
    this.height = buttonRealSize.height;
    this.width = buttonRealSize.width;
    if (this.centered[0]) {
      this.x = ((this.parent as any)?.x ?? 0) + Math.round((parenSize.width - this.width) / 2);
    }
    if (this.centered[1]) {
      this.y = ((this.parent as any)?.y ?? 0) + Math.round((parenSize.height - this.height) / 2);
    }
  }

  getRealSize() {
    return {
      width: 0,
      height: 0,
    };
  }

  render(ctx: CanvasRenderingContext2D, xOffset: number = 0, yOffset: number = 0) {
    if (this.inverted !== -1) {
      ctx.filter = `invert(${this.inverted})`;
    }
  }

  load() {
    this.loaded = true;
  }

  unload() {
    this.loaded = false;
  }
}
