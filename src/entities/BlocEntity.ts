import Entity from './Entity';

export default class BlocEntity extends Entity {
  isDark: boolean;

  constructor(x: number, y: number, width: number, height: number, isDark: boolean) {
    super(x, y, width, height);
    this.isDark = isDark;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isDark ? 'black' : '#D3D3D3';
    ctx.strokeStyle = '#B8B8B8';
    ctx.lineWidth = 3;

    ctx.setLineDash([5]);

    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 4);
    if (!this.isDark) {
      ctx.stroke();
    }
    ctx.fill();
  }
}
