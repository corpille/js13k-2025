import { treatImage } from './assets';
import { darkBackground, levels, leveltLocalStorageKey, lightBackground, treatLocalStorageKey } from './config';
import { UiList } from './ui-elements/UiList';
import { UiScene } from './ui-elements/Scene';
import { UiText } from './ui-elements/UiText';
import { UiImage } from './ui-elements/UiImage';
import { UiButton } from './ui-elements/UiButton';
import Game from './Game';

export const startSym = Symbol('start');
export const gameSym = Symbol('game');
export const endSym = Symbol('end');
export const levelSym = Symbol('level');

// Start Scene
export function getStartScene(): UiScene {
  const startScene = new UiScene(lightBackground);
  const startList = new UiList(0, 0, [true, true]);
  const title = new UiText(0, 0, 'Untitled Game', 12, [true, false]);
  startList.add(title);

  if ((Game.instance.currentLvl || Game.instance.treatCount) && Game.instance.currentLvl < 6) {
    const continueButton = new UiButton(0, 0, 'Continue', [true, false]);
    continueButton.onClick = () => {
      Game.instance.restart(Game.instance.currentLvl);
    };
    startList.add(continueButton);
  }
  if (Game.instance.currentLvl) {
    const levelButton = new UiButton(0, 0, 'Load level', [true, false]);
    levelButton.onClick = () => {
      Game.instance.scenes[levelSym] = getLevelScene();
      Game.instance.loadScene(levelSym);
    };
    startList.add(levelButton);
  }

  const newGameButton = new UiButton(0, 0, 'New Game', [true, false]);
  newGameButton.onClick = () => {
    localStorage.setItem(treatLocalStorageKey, '[]');
    localStorage.setItem(leveltLocalStorageKey, '0');
    Game.instance.restart();
  };

  startList.add(newGameButton);
  startScene.add(startList);
  return startScene;
}

export function getLevelScene(): UiScene {
  const levelScene = new UiScene(lightBackground);
  const sceneList = new UiList(0, 0, [true, true]);

  const text = new UiText(0, 0, 'Choose a level', 5, [true, false]);
  sceneList.add(text);

  const levelList = new UiList(0, 0, [true, false], 'row');
  levels.forEach((level, i) => {
    const lvlButton = new UiButton(
      0,
      0,
      `${level.name}`,
      [false, true],
      treatImage,
      Game.instance.treatsFound.indexOf(i) === -1,
    );
    if (i > Game.instance.currentLvl) {
      lvlButton.disabled = true;
    }
    lvlButton.onClick = () => {
      Game.instance.restart(i);
    };
    levelList.add(lvlButton);
  });
  sceneList.add(levelList);

  const backButton = new UiButton(0, 0, 'Back', [true, false]);
  backButton.onClick = () => {
    Game.instance.loadScene(startSym);
  };
  sceneList.add(backButton);
  levelScene.add(sceneList);
  return levelScene;
}

// Game Scene
export const gameScene = new UiScene();
const treatInfo = new UiList(16, 16, [false, false], 'row', 8);
const treatUiImage = new UiImage(0, 0, 2, treatImage, [false, true]);
export const treatCounter = new UiText(0, 0, '0', 3, [false, true]);
treatInfo.add(treatUiImage);
treatInfo.add(treatCounter);
gameScene.add(treatInfo);

// End Scene
export const endScene = new UiScene(darkBackground);
const endList = new UiList(0, 0, [true, true], 'column');
endList.inverted = 1;
const endMessage = new UiText(0, 0, 'GG WP', 12, [true, false]);
const restartButton = new UiButton(0, 0, 'Back to menu', [true, false]);

restartButton.onClick = () => {
  Game.instance.loadScene(startSym);
};

const treatLayout = new UiList(0, 0, [true, false], 'row');
const treatUiImage2 = new UiImage(8, 6, 3, treatImage, [false, true]);

export const treatEndCounter = new UiText(0, 16, '0', 5, [false, true]);
treatLayout.add(treatUiImage2);
treatUiImage2.inverted = 0;
treatLayout.add(treatEndCounter);
endList.add(endMessage);
endList.add(treatLayout);
endList.add(restartButton);
endScene.add(endList);
