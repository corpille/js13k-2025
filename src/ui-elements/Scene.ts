import { gridRealHeight, gridRealWidth } from '../config';
import { UiElement } from './UiElement';

export class UiScene {
  elements: UiElement[] = [];
  isLoaded = false;
  background: string;

  constructor(background: string = 'transparent') {
    this.background = background;
  }

  getRealSize() {
    return {
      width: gridRealWidth,
      height: gridRealHeight,
    };
  }

  add(element: UiElement) {
    element.setParent(this);
    this.elements.push(element);
  }

  load() {
    this.isLoaded = true;
    this.elements.forEach((element) => {
      element.load();
    });
  }

  unload() {
    this.isLoaded = false;
    this.elements.forEach((element) => {
      element.unload();
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw background
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, gridRealWidth, gridRealHeight);
    ctx.closePath();
    ctx.restore();

    this.elements.forEach((element) => {
      ctx.save();
      element.render(ctx);
      ctx.restore();
    });
  }
}
