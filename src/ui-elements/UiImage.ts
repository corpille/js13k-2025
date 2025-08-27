import { UiElement } from './UiElement';

export class UiImage extends UiElement {
  image: HTMLImageElement;

  constructor(x: number, y: number, size: number, image: HTMLImageElement, centered: boolean[] = [false, false]) {
    super(x, y, size, centered);
    this.image = image;
    this.centerElement();
  }

  getRealSize() {
    return {
      width: this.image.width * this.size,
      height: this.image.height * this.size,
    };
  }

  render(ctx: CanvasRenderingContext2D, inverted: boolean) {
    ctx.save();
    super.render(ctx, inverted);
    ctx.drawImage(this.image, this.x, this.y, this.image.width * this.size, this.image.height * this.size);
    ctx.restore();
  }
}
