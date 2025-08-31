import { backgrounds } from '../background';
import { getGridRealHeight, getGridRealWidth, gridRealHeight, gridRealWidth, lightBackground } from '../config';
import Game from '../Game';

import { UiElement } from './UiElement';

export class UiScene {
  x: number = 0;
  y: number = 0;
  elements: UiElement[] = [];
  isLoaded = false;
  background?: string;
  needRefresh: boolean = true;
  autoRefresh: boolean = false;
  onLoad: Function = () => {};
  centered: boolean[] = [true, true];

  get height() {
    return getGridRealWidth();
  }
  get width() {
    return getGridRealHeight();
  }

  constructor(autoRefresh: boolean = false, background?: string) {
    this.background = background;
    this.autoRefresh = autoRefresh;
  }

  getRealSize() {
    return {
      width: getGridRealWidth(),
      height: getGridRealHeight(),
    };
  }

  update() {
    this.elements.forEach((e) => e.centerElement());
  }

  add(element: UiElement) {
    element.setParent(this);
    element.needRender = true;
    this.elements.push(element);
  }

  load() {
    this.isLoaded = true;
    this.needRefresh = true;
    this.onLoad();
    this.elements.forEach((element) => {
      element.load();
    });
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
    if (this.needRefresh) {
      if (!this.background && backgrounds[Game.instance.currentLvl]) {
        ctx.clearRect(0, 0, getGridRealWidth(), getGridRealHeight());
        ctx.drawImage(backgrounds[Game.instance.currentLvl], 0, 0, getGridRealWidth(), getGridRealHeight());
      } else if (this.background) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, getGridRealWidth(), getGridRealHeight());
        ctx.closePath();
        ctx.restore();
      }
    }
    this.needRefresh = this.autoRefresh;
    this.elements.forEach((element) => {
      ctx.save();
      if (this.autoRefresh) {
        element.needRender = true;
      }
      element.render(ctx, false);
      ctx.restore();
    });
  }
}
