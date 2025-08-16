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
  end: [38, 17],
};

const level2Data = {
  startX: 1,
  startY: 18,
  b: [
    [-1, 19, 7, 1, true],
    [9, 19, 7, 1, false],
    [19, 19, 7, 1, true],
    [29, 19, 3, 1, false],
    [35, 19, 6, 1, true],
  ],
  end: [38, 17],
};

const level3Data = {
  startX: 1,
  startY: 18,
  b: [
    [-1, 19, 7, 1, true],
    [9, 16, 6, 1, false],
    [18, 14, 2, 1, true],
    [13, 11, 3, 1, false],
    [6, 9, 4, 1, true],
    [2, 7, 2, 1, false],
    [6, 5, 3, 1, true],
    [11, 3, 13, 1, false],
    [30, 14, 11, 1, true],
  ],
  end: [38, 12],
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
