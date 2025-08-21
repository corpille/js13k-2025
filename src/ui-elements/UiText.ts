import { displayString, getTextRealSizes } from '../ui';
import { UiElement } from './UiElement';

export class UiText extends UiElement {
  _text: string;

  constructor(x: number, y: number, text: string, size: number, centered?: boolean[]) {
    super(x, y, size, centered);
    this.text = text;
    this.centerElement();
  }

  set text(value: string) {
    this._text = value;
    if (this.parent) {
      this.parent.update();
    }
  }

  getRealSize() {
    return getTextRealSizes(this._text, this.size);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    super.render(ctx);
    displayString(ctx, this.x, this.y, this._text, this.size);
    ctx.restore();
  }
}
