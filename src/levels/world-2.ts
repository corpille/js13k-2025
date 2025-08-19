const level1 = {
  name: '2-1',
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 7, 1, true],
    [8, 3, 7, 1, false, 10],
    [27, 11, 5, 1, true, 0, -10],
    [27, 8, 5, 1, false],
    [7, 14, 4, 1, false, 10],
    [0, 14, 4, 1, true],
    [24, 11, 3, 1, true, 0, 5],
    [32, 18, 9, 1, false],
  ],
  end: [37, 19],
  treat: [1, 15],
};

const level2 = {
  name: '2-2',
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 7, 1, true],
    [23, 2, 7, 1, false, -14],
    [19, 3, 1, 3, false],
    [19, 6, 1, 1, true],
    [32, 4, 4, 1, true],
    [30, 5, 1, 4, false],
    [27, 8, 3, 1, false],
    [14, 11, 4, 1, true, 7],
    [9, 11, 4, 1, false, -7],
    [6, 15, 1, 1, true],
    [12, 17, 2, 1, false],
    [16, 17, 3, 1, true, 13],
    [24, 18, 1, 2, true],
    [24, 20, 1, 1, false],
    [35, 18, 6, 1, false],
  ],
  end: [37, 19],
  treat: [34, 5],
};

const level3 = {
  name: '2-3',
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 7, 1, true],
    [8, 3, 4, 1, false, 8],
    [12, 3, 4, 1, true, 8],
    [13, 4, 1, 4, false],
    [15, 9, 2, 1, true, 0, 4],
    [5, 8, 3, 1, false],
    [0, 6, 2, 1, true, 0, 6],
    [2, 15, 2, 1, false, 0, -6],
    [5, 17, 4, 1, true],

    [23, 0, 1, 1, true],

    [10, 18, 3, 1, false, 7],
    [15, 19, 1, 2, false],
    [15, 21, 1, 1, true],

    [33, 4, 1, 20, true],
    [33, 0, 1, 1, true],
    [35, 8, 1, 1, false],
    [36, 14, 1, 1, false],
    [35, 0, 2, 1, false, 0, 19],
    [37, 18, 4, 1, false],
  ],
  end: [38, 19],
  treat: [23, 1],
};

export default [level1, level2, level3];
