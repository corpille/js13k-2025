import { btnImage, buttonHeight, buttonSideWidth, imageTextHeight } from '../assets';
import { getSquareSize, uiSquareRatio } from '../config';
import { canvas } from '../elements';
import { displayString, getTextRealSizes } from '../text-utils';
import { getCursorPosition, isPointCollission } from '../utils';
import { UiElement } from './UiElement';

const getImageButtonMagnifying = () => Math.round((2 * getSquareSize()) / uiSquareRatio);

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
    centered: boolean[],
    image?: HTMLImageElement,
    disableImage: boolean = false,
    size: number = 4,
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
    const isOnButton = isPointCollission(coords, this);
    if (isOnButton && !this.hovered) {
      this.hovered = true;
      this.refresh();
    } else if (!isOnButton && this.hovered) {
      this.refresh();
      this.hovered = false;
    }
  };

  getSizes() {
    const spacing = this.size * 2;
    const textMagnifiying = Math.round((this.size / 100) * 80);
    const textWidth = getTextRealSizes(this.text, textMagnifiying).width;
    const contentWidth = textWidth + (this.image ? this.image.width * getImageButtonMagnifying() + spacing : 0);
    return { textWidth, textMagnifiying, contentWidth, spacing };
  }

  getRealSize() {
    const { contentWidth } = this.getSizes();
    return {
      width: buttonSideWidth * this.size * 2 + contentWidth,
      height: buttonHeight * this.size,
    };
  }

  render(ctx: CanvasRenderingContext2D, inverted: boolean) {
    ctx.save();
    super.render(ctx, inverted);
    const realButtonHeight = buttonHeight * this.size;
    const { contentWidth, textMagnifiying, textWidth, spacing } = this.getSizes();

    if (this.disabled) {
      ctx.filter = `invert(${inverted ? 0 : 1})`;
    }
    if (this.hovered) {
      ctx.filter = (inverted || this.inverted === 1 ? 'invert(1) ' : '') + 'brightness(0.8)';
    }

    let paddingLeft = buttonSideWidth * this.size;

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
      contentWidth,
      realButtonHeight,
    );

    ctx.save();
    ctx.filter = 'brightness(0) invert(1)';
    displayString(
      ctx,
      this.x + paddingLeft,
      this.y + Math.round((realButtonHeight - imageTextHeight * textMagnifiying) / 2),
      this.text.toUpperCase(),
      textMagnifiying,
    );
    ctx.restore();
    paddingLeft += textWidth;

    if (this.image) {
      paddingLeft += spacing;
      ctx.save();
      ctx.filter = ctx.filter.replace('invert(1)', '');
      if (this.disableImage) {
        ctx.filter = 'brightness(0.3) opacity(0.3)';
      } else {
        ctx.filter = `invert(0)`;
      }
      const imageMagnifying = getImageButtonMagnifying();
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
      buttonSideWidth + 1,
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
