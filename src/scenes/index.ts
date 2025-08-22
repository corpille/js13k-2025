import { endScene } from './endScenes';
import { gameScene } from './gameScene';
import { getLevelScene } from './levelScene';
import { getStartLoreScene } from './startLoreScene';
import { getStartScene } from './startScene';

export const startSym = Symbol('start');
export const startLoreSym = Symbol('loreStart');
export const gameSym = Symbol('game');
export const endSym = Symbol('end');
export const levelSym = Symbol('level');

export const getSscenesList = () => ({
  [startSym]: getStartScene(),
  [gameSym]: gameScene,
  [endSym]: endScene,
  [levelSym]: getLevelScene(),
  [startLoreSym]: getStartLoreScene(),
});
