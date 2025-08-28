import { endScene } from './endScenes';
import { gameScene } from './gameScene';
import { getLevelScene } from './levelScene';
import { pauseScene } from './pauseScene';
import { getStartLoreScene } from './startLoreScene';
import { getStartScene } from './startScene';
import { getTransitionScene } from './transitionScene';

export const startSym = Symbol('start');
export const startLoreSym = Symbol('loreStart');
export const gameSym = Symbol('game');
export const pauseSym = Symbol('pause');
export const endSym = Symbol('end');
export const levelSym = Symbol('level');
export const world1TransitionSym = Symbol('world1Transition');
export const world2TransitionSym = Symbol('world2Transition');

const msg = `In her feline disguise, Nyx navigated a world in the dark.
But soon the night would end and the sun would rise.
The light was relentless, its rays a physical weight.
She had to hunt to eat and struggled in a way she never had as a goddess. 
This wasn't the freedom she craved, she'd become a prisoner of another kind.`;

export const getScenesList = () => ({
  [startSym]: getStartScene(),
  [gameSym]: gameScene,
  [pauseSym]: pauseScene,
  [endSym]: endScene,
  [levelSym]: getLevelScene(),
  [startLoreSym]: getStartLoreScene(),
  [world1TransitionSym]: getTransitionScene(msg),
  [world2TransitionSym]: getTransitionScene('World 2 transition'),
});
