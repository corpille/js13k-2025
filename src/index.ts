import { gridHeight, gridWidth, squareSize } from './config';
import { canvas, end, restartButton } from './elements';
import Engine from './Engine';
import { querySelector } from './utils';

restartButton?.addEventListener('click', () => {
  restartButton.blur();
  init();
});

// Level Data
const testLevel = {
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 27, 1, true],
    [5, 3, 7, 1, true],
    [30, 0, 11, 1, false],
  ],
  m: [],
  end: [37, 10],
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

const levels = [level1Data, level2Data, level3Data];
let engine = new Engine(levels);

window.addEventListener('keydown', function (e) {
  engine.game.keys[e.code] = true;
});

window.addEventListener('keyup', function (e) {
  engine.game.keys[e.code] = false;
});

function createLvlProgression() {
  const lvls = querySelector('#lvls');
  lvls.innerHTML = '';
  levels.forEach((_, index) => {
    const lvl = document.createElement('div');
    lvl.classList.add('lvl');
    if (!index) {
      lvl.classList.add('doing');
    }
    lvls?.appendChild(lvl);
  });
}

function init() {
  if (!canvas) return;
  engine = new Engine(levels);

  canvas.height = squareSize * gridHeight;
  canvas.width = squareSize * gridWidth;
  createLvlProgression();

  end.style.height = `${squareSize * gridHeight + 8}px`;
  end.style.width = `${squareSize * gridWidth + 8}px`;
  end.style.top = '100%';
  end.style.left = `${canvas.getBoundingClientRect().left}px`;

  window.requestAnimationFrame(engine.loop.bind(engine));
}

init();
