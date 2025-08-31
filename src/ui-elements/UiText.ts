import { getSquareSize } from '../config';
import { displayString, getTextRealSizes } from '../text-utils';
import { UiElement } from './UiElement';

export class UiText extends UiElement {
  _text: string;
  needRender: boolean;

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

  render(ctx: CanvasRenderingContext2D, inverted: boolean) {
    if (!this.needRender) {
      return;
    }
    ctx.save();
    super.render(ctx, inverted);
    displayString(ctx, this.x, this.y, this._text, this.size);
    ctx.restore();
    this.needRender = false;
  }
}
