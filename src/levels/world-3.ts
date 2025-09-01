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

const level3 = {
  startX: 1,
  startY: 9,
  b: [
    [-1, 8, 5, 1, true],
    [-1, 2, 5, 1, true],
    [6, 8, 1, 10, false],
    [15, 8, 2, 1, true, -4],
    [16, 0, 1, 1, true],
    [25, 0, 3, 1, true],
    [28, 3, 1, 1, false],
    [32, 5, 2, 1, false],
    [40, 1, 1, 1, true],
  ],
  m: [
    [-1, 0, 1, 1, true],
    [5, 0, 2, 1, false],
    [7, 8, 1, 10, true],
    [8, 2, 3, 1, false, 0, 6],
    [17, 9, 2, 1, false, 4],
    [28, 0, 1, 3, true],
    [36, 9, 5, 1, true],
  ],
  end: [37, 9],
  mirrorTreat: [16, 1],
};

const level4 = {
  startX: 1,
  startY: 9,
  b: [
    [-1, 8, 5, 1, true],
    [1, 5, 5, 1, false],
    [7, 5, 1, 20, true],
    [9, 0, 2, 1, false, -6],
    [9, 4, 1, 1, false],
    [8, 8, 3, 1, true],
    [12, 3, 3, 1, true, 5],
    [17, 4, 1, 3, true],
    [24, 6, 2, 1, true, 0, -6],
    [30, 3, 1, 1, true],
    [34, 7, 2, 1, true],
    [36, 0, 5, 1, false],
  ],
  m: [
    [-1, 0, 1, 1, true],
    [0, 0, 1, 1, true],
    [6, 5, 1, 20, false],
    [10, 3, 1, 1, true],
    [15, 3, 3, 1, false, 5],
    [14, 7, 1, 1, false],
    [17, 10, 3, 1, false],
    [28, 10, 1, 1, true],
    [31, 8, 1, 1, false],
    [30, 0, 2, 1, false],
  ],
  mirrorEnd: [37, 1],
  treat: [28, 11],
};

export default [level1, level2, level3, level4];
