import { gridHeight, gridWidth, squareSize } from './config';
import { canvas, end, restartButton } from './elements';
import Engine from './Engine';
import { querySelector } from './utils';

restartButton?.addEventListener('click', () => {
  restartButton.blur();
  init();
});

// Level Data
const level1Data = {
  startX: 1,
  startY: 18,
  b: [
    [-1, 19, 27, 1, true],
    [30, 19, 11, 1, false],
  ],
  end: [37, 17],
};

const level2Data = {
  startX: 1,
  startY: 18,
  b: [
    [-1, 19, 7, 1, true],
    [8, 19, 7, 1, false, 14],
    [33, 19, 9, 1, true],
  ],
  end: [37, 17],
};

const level3Data = {
  startX: 1,
  startY: 18,
  b: [
    [-1, 19, 7, 1, true],
    [8, 16, 6, 1, false, 7],
    [24, 14, 3, 1, true],
    [12, 11, 3, 1, false, 7],
    [6, 9, 4, 1, true],
    [2, 7, 2, 1, false],
    [6, 5, 3, 1, true],
    [11, 3, 5, 1, false, 10],
    [30, 4, 11, 1, true],
  ],
  end: [37, 2],
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
