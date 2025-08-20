import { gridRealHeight, gridRealWidth } from './config';
import { canvas } from './elements';
import Engine from './Engine';
import { restartButton } from './Game';
import world1 from './levels/world-1';
import world2 from './levels/world-2';
import world3 from './levels/world-3';

restartButton.onClick = () => {
  engine = new Engine(levels);
  engine.game.started = true;
  console.log('onREStart');
  init();
};

const levels = [...world1, ...world2, ...world3];
let engine = new Engine(levels);

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
