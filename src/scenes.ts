import { treatImage } from './assets';
import { darkBackground, gridRealHeight, levels, lightBackground, squareSize } from './config';
import { UiList } from './ui-elements/UiList';
import { UiScene } from './ui-elements/Scene';
import { UiText } from './ui-elements/UiText';
import { UiImage } from './ui-elements/UiImage';
import { UiButton } from './ui-elements/UiButton';
import Game from './Game';
import world1 from './levels/world-1';

export const startSym = Symbol('start');
export const gameSym = Symbol('game');
export const endSym = Symbol('end');

// Start Scene
export function getStartScene(): UiScene {
  const startScene = new UiScene(lightBackground);
  const startList = new UiList(0, 0, [true, true]);
  const title = new UiText(0, 0, 'Untitled Game', 12, [true, false]);
  startList.add(title);

  if (Game.instance.currentLvl) {
    const continueButton = new UiButton(0, 0, 'Continue', 5, [true, false]);
    continueButton.onClick = () => {
      Game.instance.loadLevels(levels.slice(Math.min(Game.instance.currentLvl - 1, 0)));
      Game.instance.started = true;
      Game.instance.loadScene(gameSym);
    };
    startList.add(continueButton);
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
const restartButton = new UiButton(0, 0, 'Play Again', 5, [true, false]);

restartButton.onClick = () => {
  Game.instance.treatFound = [];
  Game.instance.loadLevels(levels);
  Game.instance.restart();
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
