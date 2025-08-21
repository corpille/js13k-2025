import world1 from './levels/world-1';
import world2 from './levels/world-2';
import world3 from './levels/world-3';

// Grid
export const squareSize = 40;

// Sizes
export const gridWidth = 40;
export const gridHeight = Math.round((gridWidth * 9) / 16);
export const gridRealWidth = gridWidth * squareSize;
export const gridRealHeight = gridHeight * squareSize;

// Forces
export const moveSpeed = squareSize / 5;
export const jumpSpeed = Math.round((squareSize / 5) * 4.5);
export const gravity = Math.round(-squareSize / 4);
export const forceDecrease = squareSize / 20;

export const FPS = 60;
export const animationSpeed = FPS / 10;

export const coyoteFrames = 3;
export const defaultRadius = 3000;

export const lightBackground = '#f7f6f0';
export const darkBackground = '#282828';

export const gameName = 'nyx';

export const treatLocalStorageKey = `${gameName}-treat`;
export const leveltLocalStorageKey = `${gameName}-level`;

export const levels = [...world1, ...world2, ...world3];
