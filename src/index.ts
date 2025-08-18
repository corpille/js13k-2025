import { gridHeight, gridRealHeight, gridRealWidth, gridWidth, squareSize } from './config';
import { canvas, end, restartButton } from './elements';
import Engine from './Engine';
import { querySelector } from './utils';
import world1 from './levels/world-1';
import world2 from './levels/world-2';
import world3 from './levels/world-.3';

restartButton?.addEventListener('click', () => {
  restartButton.blur();
  engine = new Engine(levels);
  init();
});

// DEBUG
// Level Data
const testLevel = {
  startX: 4,
  startY: 5,
  b: [
    [-1, 0, 17, 1, true],
    [5, 1, 1, 4, true],
    [1, 1, 1, 4, true],
    [1, 7, 5, 1, true],
    [10, 1, 1, 10, true],
    // [5, 3, 7, 1, true],
    // [10, 7, 7, 1, true],
    [25, 0, 16, 1, false],
  ],
  // m: [
  //   [-1, 0, 7, 1, true],
  //   [10, 7, 7, 1, true],
  // ],
  end: [37, 1],
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

  end.style.height = `${gridRealHeight + 10 * 2}px`;
  end.style.width = `${gridRealWidth + 10 * 2}px`;
  end.style.top = '1000%';
  end.style.left = `${canvas.getBoundingClientRect().left}px`;

  window.requestAnimationFrame(engine.loop.bind(engine));
}

init();
