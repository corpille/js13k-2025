import { btnImage, buttonHeight, buttonSideWidth, textHeight } from '../assets';
import { canvas } from '../elements';
import { displayString, getButtonRealSizes, getTextRealSizes } from '../ui';
import { getCursorPosition, isPointCollission } from '../utils';
import { UiElement } from './UiElement';

const imageMagnifying = 2;
export class UiButton extends UiElement {
  text: string;
  onClick: Function = () => {};
  hovered: boolean = false;
  disabled: boolean = false;
  image: HTMLImageElement | undefined;
  disableImage: boolean;

  constructor(
    x: number,
    y: number,
    text: string,
    size: number,
    centered: boolean[],
    image?: HTMLImageElement,
    disableImage: boolean = false,
  ) {
    super(x, y, size, centered);
    this.text = text;
    this.image = image;
    this.disableImage = disableImage;
    this.centerElement();
  }

  load() {
    super.load();
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mousemove', this.onMouseHover);
  }

  unload() {
    super.unload();
    canvas.removeEventListener('mousedown', this.onMouseDown);
    canvas.removeEventListener('mousemove', this.onMouseHover);
  }

  onMouseDown = (e: MouseEvent) => {
    if (this.disabled) return;
    const coords = getCursorPosition(e);
    if (isPointCollission(coords, this)) {
      this.onClick();
    }
  };

  onMouseHover = (e: MouseEvent) => {
    if (this.disabled) return;
    const coords = getCursorPosition(e);
    if (isPointCollission(coords, this)) {
      this.hovered = true;
    } else {
      this.hovered = false;
    }
  };

  getRealSize() {
    const textMagnifiying = this.size - 2;
    const textWidth = getTextRealSizes(this.text, textMagnifiying).width;
    const contentWidth = textWidth + (this.image ? this.image.width * imageMagnifying : 0);
    const buttonWidth = contentWidth + this.size * 2;
    return {
      width: buttonWidth + buttonSideWidth * this.size * 2,
      height: buttonHeight * this.size,
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    super.render(ctx);
    const realButtonHeight = buttonHeight * this.size;
    const textMagnifiying = this.size - 2;
    const textWidth = getTextRealSizes(this.text, textMagnifiying).width;
    const contentWidth = textWidth + (this.image ? this.image.width * imageMagnifying : 0);
    const buttonWidth = contentWidth + this.size * 2;
    if (this.disabled) {
      ctx.filter = 'invert(1)';
    } else if (this.hovered) {
      ctx.filter = 'contrast(.6)';
    }

    let paddingLeft = buttonSideWidth * this.size + this.size;

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
      realButtonHeight,
    );

    ctx.drawImage(
      btnImage,
      buttonSideWidth,
      0,
      1,
      buttonHeight,
      this.x + buttonSideWidth * this.size,
      this.y,
      buttonWidth,
      realButtonHeight,
    );

    ctx.save();
    ctx.filter = 'invert(1)';
    displayString(
      ctx,
      this.x + paddingLeft,
      this.y + Math.round((realButtonHeight - textHeight * textMagnifiying) / 2),
      this.text,
      textMagnifiying,
    );
    ctx.restore();
    paddingLeft += textWidth;

    paddingLeft += this.size;

    if (this.image) {
      ctx.save();
      if (this.disableImage) {
        ctx.filter = 'brightness(0.3) opacity(0.3)';
      }
      ctx.drawImage(
        this.image,
        this.x + paddingLeft,
        this.y + Math.round((realButtonHeight - this.image.height * imageMagnifying) / 2),
        this.image.width * imageMagnifying,
        this.image.height * imageMagnifying,
      );
      paddingLeft += this.image.width * imageMagnifying;
      ctx.restore();
    }
    //End
    ctx.drawImage(
      btnImage,
      buttonSideWidth + 2,
      0,
      buttonSideWidth,
      buttonHeight,
      this.x + paddingLeft,
      this.y,
      buttonSideWidth * this.size,
      realButtonHeight,
    );
    ctx.restore();
  }
}
