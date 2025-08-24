import { endScene } from './endScenes';
import { gameScene } from './gameScene';
import { getLevelScene } from './levelScene';
import { getStartLoreScene } from './startLoreScene';
import { getStartScene } from './startScene';
import { getTransitionScene } from './transitionScene';

export const startSym = Symbol('start');
export const startLoreSym = Symbol('loreStart');
export const gameSym = Symbol('game');
export const endSym = Symbol('end');
export const levelSym = Symbol('level');
export const world1TransitionSym = Symbol('world1Transition');
export const world2TransitionSym = Symbol('world2Transition');

export const getScenesList = () => ({
  [startSym]: getStartScene(),
  [gameSym]: gameScene,
  [endSym]: endScene,
  [levelSym]: getLevelScene(),
  [startLoreSym]: getStartLoreScene(),
  [world1TransitionSym]: getTransitionScene('World 1 transition'),
  [world2TransitionSym]: getTransitionScene('World 2 transition'),
});
