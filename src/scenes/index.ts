import Game from '../Game';
import { scene as endScene } from './endScenes';
import { gameScene } from './gameScene';
import { getLevelScene } from './levelScene';
import { pauseScene } from './pauseScene';
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
export const endTransitionSym = Symbol('endTransition');

const startLore = `Once upon a time, Nyx, goddess of the night,
grew tired of her husband Darkness.
She always used to rely on him to do anything
and this was not suiting her anymore.
So, one morning, disguised as a cat
She sneaked her way out and left the heavens
only to be followed by a looming darkness`;

const transition1 = `In her feline disguise, Nyx navigated a world in the dark.
But soon the night would end and the sun would rise.
The light was relentless, its rays a physical weight.
She had to hunt to eat and struggled in a way she never had as a goddess. 
This wasn't the freedom she craved, she'd become a prisoner of another kind.`;

const transition2 = `Beyond the brightness, Nyx saw a flicker of movement. 
Shifted in a mirror dimension, a small, white cat was peeking at her. 
Its fur was the color of snow and its eyes a deep blue. 
It moved with a serene grace, strangely unafraid of the light. 
At the sight of Nyx's look, the white cat ran away.
Drawn to her precense, she pierce through the dimensions and followed her.`;

const transition3 = `Nyx gave her whole to try to catch up with the other cat.
When she finally managed to, the little cat look right at her.
Its gaze pierced right throught her, and that's when she knew. 
This was her daughter, Aether, personification of the light itself.
She was just born and had come to show her the way back home.`;

export const getScenesList = () => ({
  [startSym]: getStartScene(),
  [gameSym]: gameScene,
  [pauseSym]: pauseScene,
  [endSym]: endScene,
  [levelSym]: getLevelScene(),
  [startLoreSym]: getTransitionScene(startLore, 'Leave', () => {
    Game.instance.started = true;
    Game.instance.loadScene(gameSym);
  }),
  [world1TransitionSym]: getTransitionScene(transition1),
  [world2TransitionSym]: getTransitionScene(transition2),
  [endTransitionSym]: getTransitionScene(transition3, 'Go back home', () => {
    Game.instance.loadScene(endSym);
    Game.instance.reset();
  }),
});
