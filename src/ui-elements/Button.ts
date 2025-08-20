import { btnImage, buttonHeight, buttonSideWidth, textHeight } from '../assets';
import { FPS } from '../config';
import { canvas } from '../elements';
import { displayString, getButtonRealSizes, getTextRealSizes } from '../ui';
import { getCursorPosition, isPointCollission } from '../utils';
import { UiElement } from './UiElement';

export class Button extends UiElement {
  x: number;
  y: number;
  text: string;
  size: number;
  centered: boolean[];
  height: number;
  width: number;
  onClick: Function = () => {};
  hovered: boolean;
  rendered: boolean = false;

  constructor(x: number, y: number, text: string, size: number, centered: boolean[]) {
    super(x, y, text, size, centered);

    canvas.addEventListener('mousedown', (e) => {
      if (this.rendered) {
        const coords = getCursorPosition(e);
        if (isPointCollission(coords, this)) {
          this.onClick();
        }
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (this.rendered) {
        const coords = getCursorPosition(e);
        if (isPointCollission(coords, this)) {
          this.hovered = true;
          canvas.style.cursor = 'pointer';
        } else {
          this.hovered = false;
          canvas.style.cursor = 'initial';
        }
      }
    });
  }

  getRealSize() {
    return getButtonRealSizes(this.text, this.size);
  }

  render(ctx: CanvasRenderingContext2D) {
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
      this.x,
      this.y,
      buttonSideWidth * this.size,
      buttonHeight * this.size,
    );

    ctx.drawImage(
      btnImage,
      buttonSideWidth,
      0,
      1,
      buttonHeight,
      this.x + buttonSideWidth * this.size,
      this.y,
      buttonLength,
      buttonHeight * this.size,
    );

    ctx.save();
    ctx.filter = 'invert(1)';
    displayString(
      ctx,
      this.x + Math.round((buttonLength - textLength) / 2) + buttonSideWidth * this.size,
      this.y + Math.round((buttonHeight * this.size - textHeight * textMagnifiying) / 2),
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
      this.x + buttonLength + buttonSideWidth * this.size,
      this.y,
      buttonSideWidth * this.size,
      buttonHeight * this.size,
    );
  }
}
