import { gridRealHeight, gridRealWidth } from '../config';
import { UiElement } from './UiElement';

export class UiScene {
  elements: UiElement[] = [];
  isLoaded = false;
  background: string;
  needRefresh: boolean = true;
  autoRefresh: boolean = false;
  onLoad: Function = () => {};

  constructor(background: string = 'transparent', autoRefresh: boolean = false) {
    this.background = background;
    this.autoRefresh = autoRefresh;
  }

  getRealSize() {
    return {
      width: gridRealWidth,
      height: gridRealHeight,
    };
  }

  update() {
    this.elements.forEach((e) => e.centerElement());
  }

  add(element: UiElement) {
    element.setParent(this);
    this.elements.push(element);
  }

  load() {
    this.isLoaded = true;
    this.needRefresh = true;
    this.elements.forEach((element) => {
      element.load();
    });
    this.onLoad();
  }

  refresh() {
    this.needRefresh = true;
  }

  unload() {
    this.isLoaded = false;
    this.elements.forEach((element) => {
      element.unload();
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    this.needRefresh = this.autoRefresh;
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
