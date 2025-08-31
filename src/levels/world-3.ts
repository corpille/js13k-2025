const level1 = {
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 8, 1, true],
    [8, 8, 5, 1, false],
    [17, 0, 4, 1, true, 0, 8],
    [36, 0, 5, 1, true],
  ],
  m: [
    [-1, 0, 8, 1, true],
    [10, 4, 3, 1, false],
    [31, 8, 4, 1, false, -8],
  ],
  end: [37, 1],
  treat: [10, 9],
};

const level2 = {
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 8, 1, true],
    [9, 1, 3, 1, false, 6],
    [9, 7, 2, 1, true],
    [22, 1, 1, 1, true],
    [25, 10, 3, 1, false, -8],
    [30, 8, 2, 1, true],
  ],
  m: [
    [-1, 0, 8, 1, true],
    [16, 8, 1, 1, false],
    [25, 1, 2, 1, false, 0, 7],
    [37, 0, 3, 1, true],
    [30, 0, 2, 1, false],
    [-1, 8, 6, 1, false],
  ],
  mirrorEnd: [1, 9],
  mirrorTreat: [39, 1],
};

export default [level1, level2];
