import { btnImage, buttonHeight, buttonSideWidth, textHeight } from '../assets';
import { canvas } from '../elements';
import { displayString, getButtonRealSizes, getTextRealSizes } from '../ui';
import { getCursorPosition, isPointCollission } from '../utils';
import { UiElement } from './UiElement';

export class UiButton extends UiElement {
  text: string;
  onClick: Function = () => {};
  hovered: boolean = false;

  constructor(x: number, y: number, text: string, size: number, centered: boolean[]) {
    super(x, y, size, centered);
    this.text = text;
    this.centerElement();
  }

  load() {
    super.load();
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseHover.bind(this));
  }

  unload() {
    super.unload();
    canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.removeEventListener('mousemove', this.onMouseHover.bind(this));
  }

  onMouseDown(e: MouseEvent) {
    const coords = getCursorPosition(e);
    if (isPointCollission(coords, this)) {
      this.onClick();
    }
  }

  onMouseHover(e: MouseEvent) {
    const coords = getCursorPosition(e);
    if (isPointCollission(coords, this)) {
      this.hovered = true;
      canvas.style.cursor = 'pointer';
    } else {
      this.hovered = false;
      canvas.style.cursor = 'initial';
    }
  }

  getRealSize() {
    return getButtonRealSizes(this.text, this.size);
  }

  render(ctx: CanvasRenderingContext2D, xOffset: number = 0, yOffset: number = 0) {
    ctx.save();
    super.render(ctx);
    const textMagnifiying = this.size - 2;
    const textLength = getTextRealSizes(this.text, textMagnifiying).width;
    const buttonLength = textLength + this.size * 2;
    if (this.hovered) {
      ctx.filter = 'contrast(.6)';
    }

    //Start
    ctx.drawImage(
      btnImage,
      0,
      0,
      buttonSideWidth,
      buttonHeight,
      xOffset + this.x,
      yOffset + this.y,
      buttonSideWidth * this.size,
      buttonHeight * this.size,
    );

    ctx.drawImage(
      btnImage,
      buttonSideWidth,
      0,
      1,
      buttonHeight,
      xOffset + this.x + buttonSideWidth * this.size,
      yOffset + this.y,
      buttonLength,
      buttonHeight * this.size,
    );

    ctx.save();
    ctx.filter = 'invert(1)';
    displayString(
      ctx,
      xOffset + this.x + Math.round((buttonLength - textLength) / 2) + buttonSideWidth * this.size,
      yOffset + this.y + Math.round((buttonHeight * this.size - textHeight * textMagnifiying) / 2),
      this.text,
      textMagnifiying,
    );
    ctx.restore();

    //End
    ctx.drawImage(
      btnImage,
      buttonSideWidth + 1,
      0,
      buttonSideWidth,
      buttonHeight,
      xOffset + this.x + buttonLength + buttonSideWidth * this.size,
      yOffset + this.y,
      buttonSideWidth * this.size,
      buttonHeight * this.size,
    );
    ctx.restore();
  }
}
