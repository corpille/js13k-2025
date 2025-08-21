import { gridRealHeight, gridRealWidth } from './config';
import { canvas } from './elements';
import Engine from './Engine';
import world1 from './levels/world-1';
import world2 from './levels/world-2';
import world3 from './levels/world-3';
import { restartButton } from './scenes';

const levels = [...world1, ...world2, ...world3];

restartButton.onClick = () => {
  engine = new Engine(levels);
  engine.game.started = true;
  engine.game.loadScene('game');
  init();
};

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
