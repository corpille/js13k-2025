import Audio from './AudioEngine';
import { computedSizes, gridRealHeight, getGridRealWidth, getDefaultRadius } from './config';
import { canvas } from './elements';
import Engine from './Engine';
import Game from './Game';

const engine = new Engine();

window.addEventListener('keydown', function (e) {
  engine.game.keys[e.code] = true;
  // if (e.code === 'KeyR') {
  //   Audio.instance.playBgMusic();
  // }
});

window.addEventListener('keyup', function (e) {
  engine.game.keys[e.code] = false;
});

function init() {
  if (!canvas) return;

  canvas.height = gridRealHeight;
  canvas.width = getGridRealWidth();

  window.addEventListener('resize', () => {
    computedSizes();
    canvas.height = gridRealHeight;
    canvas.width = getGridRealWidth();
    Game.instance.radius = getDefaultRadius();
    Game.instance.scenes[Game.instance.currentScene].update();
    Game.instance.scenes[Game.instance.currentScene].needRefresh = true;
  });

  window.requestAnimationFrame(engine.loop.bind(engine));
}

init();
