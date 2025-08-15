// Sizes
export const gridWidth = 40;
export const gridHeight = gridWidth / 2;

// Grid
export const squareSize = Math.round(((window.innerWidth / 100) * 65) / gridWidth);

// Forces
export const moveSpeed = squareSize / 5;
export const jumpSpeed = (squareSize / 5) * 4;
export const gravity = squareSize / 4;
export const forceDecrease = squareSize / 20;
