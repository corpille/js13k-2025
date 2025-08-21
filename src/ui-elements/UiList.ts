import { UiScene } from './Scene';
import { UiElement } from './UiElement';

export class UiList extends UiElement {
  elements: UiElement[] = [];
  direction: string;
  gap: number;

  constructor(
    x: number,
    y: number,
    centered: boolean[] = [false, false],
    direction: string = 'column',
    gap: number = 30,
  ) {
    super(x, y, 0, centered);
    this.direction = direction;
    this.gap = gap;
  }

  getRealSize() {
    const spacings = (this.elements.length - 1) * this.gap;
    return {
      width: this.elements.reduce((w, e) => w + e.getRealSize().width, 0) + (this.direction === 'row' ? spacings : 0),
      height:
        this.elements.reduce((h, e) => h + e.getRealSize().height, 0) + (this.direction === 'column' ? spacings : 0),
    };
  }

  load() {
    this.loaded = true;
    this.elements.forEach((element) => {
      element.load();
    });
  }

  unload() {
    this.loaded = false;
    this.elements.forEach((element) => {
      element.unload();
    });
  }

  centerElement() {
    super.centerElement();
    this.updateElements();
  }

  setParent(parent: UiElement | UiScene) {
    super.setParent(parent);
    this.updateElements();
  }

  updateElements() {
    this.elements.reduce((offset, element) => {
      if (this.direction === 'column') {
        element.y = this.y + offset;
        offset += element.getRealSize().height + this.gap;
      } else if (this.direction === 'row') {
        element.x = this.x + offset;
        offset += element.getRealSize().width + this.gap;
      }
      return offset;
    }, 0);
    this.elements.forEach((e) => e.centerElement());
  }

  add(element: UiElement) {
    element.setParent(this);
    this.elements.push(element);
    this.updateElements();
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    super.render(ctx);
    this.elements.forEach((element) => {
      ctx.save();
      element.render(ctx);
      ctx.restore();
    });
    ctx.restore();
  }
}
