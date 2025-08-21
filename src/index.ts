import { gridRealHeight, gridRealWidth } from './config';
import { canvas } from './elements';
import Engine from './Engine';

const engine = new Engine();

window.addEventListener('keydown', function (e) {
  engine.game.keys[e.code] = true;
});

window.addEventListener('keyup', function (e) {
  engine.game.keys[e.code] = false;
});

function init() {
  if (!canvas) return;

  canvas.height = gridRealHeight;
  canvas.width = gridRealWidth;

  window.requestAnimationFrame(engine.loop.bind(engine));
}

init();
