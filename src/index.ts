import { gridHeight, gridRealHeight, gridRealWidth, gridWidth, squareSize } from './config';
import { canvas, end, restartButton } from './elements';
import Engine from './Engine';
import { querySelector } from './utils';

restartButton?.addEventListener('click', () => {
  restartButton.blur();
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

const level1Data = {
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 27, 1, true],
    [30, 0, 11, 1, false],
  ],
  end: [37, 1],
};

const level2Data = {
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 7, 1, true],
    [8, 0, 7, 1, false, 14],
    [33, 0, 9, 1, true],
  ],
  end: [37, 1],
};

const level3Data = {
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 7, 1, true],
    [8, 3, 6, 1, false, 7],
    [24, 5, 3, 1, true],
    [12, 8, 3, 1, false, 7],
    [6, 10, 4, 1, true],
    [2, 13, 2, 1, false],
    [6, 14, 3, 1, true],
    [11, 16, 5, 1, false, 11],
    [30, 15, 11, 1, true],
  ],
  end: [37, 16],
};

const level4Level = {
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 7, 1, true],
    [5, 3, 7, 1, false],
    [25, 0, 16, 1, false],
  ],
  m: [
    [-1, 0, 7, 1, true],
    [10, 7, 7, 1, true],
  ],
  end: [37, 1],
};

const levels = [level1Data, level2Data, level3Data, level4Level];
let engine = new Engine(levels);

window.addEventListener('keydown', function (e) {
  engine.game.keys[e.code] = true;
});

window.addEventListener('keyup', function (e) {
  engine.game.keys[e.code] = false;
});

function init() {
  if (!canvas) return;
  engine = new Engine(levels);

  canvas.height = gridRealHeight;
  canvas.width = gridRealWidth;

  end.style.height = `${gridRealHeight + 10 * 2}px`;
  end.style.width = `${gridRealWidth + 10 * 2}px`;
  end.style.top = '1000%';
  end.style.left = `${canvas.getBoundingClientRect().left}px`;

  window.requestAnimationFrame(engine.loop.bind(engine));
}

init();
