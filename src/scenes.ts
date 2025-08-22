import { treatImage } from './assets';
import { darkBackground, gridRealHeight, levels, lightBackground, squareSize } from './config';
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

  if (Game.instance.currentLvl) {
    const continueButton = new UiButton(0, 0, 'Continue', 5, [true, false]);
    continueButton.onClick = () => {
      Game.instance.loadLevels(levels.slice(Math.max(Game.instance.currentLvl - 1, 0)));
      Game.instance.started = true;
      Game.instance.loadScene(gameSym);
    };
    startList.add(continueButton);

    const levelButton = new UiButton(0, 0, 'Load level', 5, [true, false]);
    levelButton.onClick = () => {
      Game.instance.scenes[levelSym] = getLevelScene();
      Game.instance.loadScene(levelSym);
    };
    startList.add(levelButton);
  }

  const newGameButton = new UiButton(0, 0, 'New Game', 5, [true, false]);
  newGameButton.onClick = () => {
    Game.instance.treatFound = [];
    Game.instance.loadLevels(levels);
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
      5,
      [false, true],
      treatImage,
      Game.instance.treatsFound.indexOf(i) === -1,
    );
    if (i > Game.instance.currentLvl) {
      lvlButton.disabled = true;
    }
    lvlButton.onClick = () => {
      Game.instance.loadLevels(levels);
      Game.instance.currentLvl = i;
      Game.instance.started = true;
      Game.instance.loadScene(gameSym);
    };
    levelList.add(lvlButton);
  });
  sceneList.add(levelList);

  const backButton = new UiButton(0, 0, 'Back', 5, [true, false]);
  backButton.onClick = () => {
    Game.instance.loadScene(startSym);
  };
  sceneList.add(backButton);
  levelScene.add(sceneList);
  return levelScene;
}

// Game Scene
export const gameScene = new UiScene();
const treatUiImage = new UiImage(8, 6, 2, treatImage);
export const treatCounter = new UiText(treatUiImage.x + treatUiImage.getRealSize().width, 16, '0', 3);
gameScene.add(treatCounter);
gameScene.add(treatUiImage);

// End Scene
export const endScene = new UiScene(darkBackground);
const endList = new UiList(0, 0, [true, true], 'column', 20);
endList.inverted = 1;
const endMessage = new UiText(0, 0, 'GG WP', 12, [true, false]);
const restartButton = new UiButton(0, 0, 'Back to menu', 5, [true, false]);

restartButton.onClick = () => {
  Game.instance.loadScene(startSym);
};

const treatLayout = new UiList(0, 0, [true, false], 'row', 0);
const treatUiImage2 = new UiImage(8, 6, 3, treatImage, [false, true]);

export const treatEndCounter = new UiText(0, 16, '0', 5, [false, true]);
treatLayout.add(treatUiImage2);
treatUiImage2.inverted = 0;
treatLayout.add(treatEndCounter);
endList.add(endMessage);
endList.add(treatLayout);
endList.add(restartButton);
endScene.add(endList);
