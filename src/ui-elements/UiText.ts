import { textHeight, textImage, textWidth } from '../assets';
import { getTextRealSizes } from '../ui';
import { UiElement } from './UiElement';

export class UiText extends UiElement {
  text: string;

  constructor(x: number, y: number, text: string, size: number, centered?: boolean[]) {
    super(x, y, size, centered);
    this.text = text;
    this.centerElement();
  }

  getRealSize() {
    return getTextRealSizes(this.text, this.size);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    super.render(ctx);
    this.text
      .toUpperCase()
      .split('')
      .forEach((c, i) => {
        const code = c.charCodeAt(0);
        let index = 0;
        if (code >= 65) {
          index = code - 65;
        } else if (code === 35) {
          index = 36;
        } else if (code === 45) {
          index = 37;
        } else if (code === 32) {
          index = 38;
        } else {
          index = code - 48 + 26;
        }
        ctx.drawImage(
          textImage,
          0 + index * textWidth,
          0,
          5,
          textHeight,
          this.x + i * textWidth * this.size + i * this.size,
          this.y,
          textWidth * this.size,
          textHeight * this.size,
        );
      });
    ctx.restore();
  }
}
