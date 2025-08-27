import { computeBackgrounds } from './background';
import { computedSizes, gridRealHeight, getGridRealWidth, getDefaultRadius } from './config';
import { canvas } from './elements';
import Engine from './Engine';
import Game from './Game';

window.addEventListener('keydown', function (e) {
  Game.instance.keys[e.code] = true;
});

window.addEventListener('keyup', function (e) {
  Game.instance.keys[e.code] = false;
});

function init() {
  if (!canvas) return;

  canvas.height = gridRealHeight;
  canvas.width = getGridRealWidth();

  canvas.style.display = 'none';
  computeBackgrounds();
  canvas.style.display = 'flex';

  window.addEventListener('resize', () => {
    computedSizes();
    canvas.height = gridRealHeight;
    canvas.width = getGridRealWidth();
    Game.instance.radius = getDefaultRadius();
    Game.instance.scenes[Game.instance.currentScene].update();
    Game.instance.scenes[Game.instance.currentScene].needRefresh = true;
  });
  const engine = new Engine();

  window.requestAnimationFrame(engine.loop.bind(engine));
}

init();
