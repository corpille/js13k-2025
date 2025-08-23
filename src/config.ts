import { canvas } from './elements';
import Game from './Game';
import world1 from './levels/world-1';
import world2 from './levels/world-2';
import world3 from './levels/world-3';

// Grid

const ratio = (x: number) => Math.round((x * 9) / 16);

const idealWidth = 20;

// Sizes
export const gridWidth = 40;
export const gridHeight = ratio(gridWidth);
export let gridRealWidth = 0; //gridWidth * getSquareSize();
let zoomRatio = 1;

export let getSquareSize = () => Math.round(gridRealWidth / gridWidth);
export let getGridRealWidth = () => gridWidth * getSquareSize();
export let getGridRealHeight = () => gridHeight * getSquareSize();
export let gridRealHeight = 0;

export function computedSizes() {
  gridRealWidth = Math.round((window.innerWidth / 100) * 80); //gridWidth * getSquareSize();
  const theoricalGridWidth = gridWidth * idealWidth;
  zoomRatio = (gridRealWidth * 100) / theoricalGridWidth / 100;
  gridRealHeight = gridHeight * getSquareSize();
}
computedSizes();

// Forces
export const getMoveSpeed = () => getSquareSize() / 5;
export const getJumpSpeed = () => Math.round((getSquareSize() / 5) * 4.5);
export const gravity = Math.round(-getSquareSize() / 4);
export const getForceDecrease = () => getSquareSize() / 20;

export const FPS = 60;

export const coyoteFrames = 3;
export const defaultRadius = 3000;

export const lightBackground = '#f7f6f0';
export const darkBackground = '#282828';

export const gameName = 'nyx';

export const treatLocalStorageKey = `${gameName}-treat`;
export const leveltLocalStorageKey = `${gameName}-level`;
export const introLocalStorageKey = `${gameName}-intro`;

const level = {
  name: '1-1',
  startX: 1,
  startY: 1,
  b: [
    [-1, 0, 12, 1, true],
    [15, 9, 2, 1, true, 0, 4],
    [18, 9, 2, 1, true, 0, -4],
    [15, 3, 2, 1, true, 4],
    [15, 1, 2, 1, true, -4],
  ],
  end: [37, 6],
  treat: [32, 6],
};

export const levels = [...world1, ...world2, ...world3];
