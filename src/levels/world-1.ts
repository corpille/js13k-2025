const level1 = {
  name: '1-1',
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 12, 1, true],
    [15, 3, 11, 1, false],
    [30, 5, 11, 1, true],
  ],
  end: [37, 6],
  treat: [32, 6],
};

const level2 = {
  name: '1-2',
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 8, 1, true],
    [0, 6, 8, 1, true],
    [11, 3, 4, 1, false],
    [18, 0, 14, 1, false],
    [30, 3, 1, 16, false],
    [37, 3, 3, 1, true],
    [31, 7, 3, 1, false],
    [37, 11, 3, 1, true],
    [31, 15, 3, 1, false],
    [37, 18, 3, 1, true],
    [27, 16, 3, 1, false],
    [18, 16, 5, 1, true],
    [8, 16, 5, 1, false],
    [-1, 18, 5, 1, true],
  ],
  end: [1, 19],
  treat: [1, 7],
};

const level3 = {
  name: '1-3',
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 8, 1, true],
    [11, 3, 1, 1, false],
    [18, 5, 1, 1, true],
    [18, 1, 2, 1, false],
    [27, 0, 5, 1, true],
    [31, 1, 1, 3, true],
    [32, 0, 4, 1, false],
    [28, 4, 1, 4, false],
    [16, 10, 8, 1, true],
    [23, 14, 8, 1, false],

    [13, 11, 1, 1, false],
    [13, 12, 1, 2, true],

    [10, 13, 1, 1, true],
    [10, 14, 1, 2, false],

    [7, 15, 1, 1, false],
    [7, 16, 1, 2, true],

    [-1, 17, 4, 1, true],
    [33, 18, 7, 1, true],
  ],
  end: [37, 19],
  treat: [1, 18],
};

export default [level1, level2, level3];
