import { levelSym } from '.';
import { gameName, leveltLocalStorageKey, lightBackground } from '../config';
import Game from '../Game';
import { UiScene } from '../ui-elements/Scene';
import { UiButton } from '../ui-elements/UiButton';
import { UiList } from '../ui-elements/UiList';
import { UiText } from '../ui-elements/UiText';
import { getLevelScene } from './levelScene';

export function getStartScene(): UiScene {
  const scene = new UiScene(lightBackground);
  const startList = new UiList(0, 0, [true, true]);
  const title = new UiText(0, 0, gameName, 12, [true, false]);
  startList.add(title);

  const buttonList = new UiList(0, 0, [true, false]);
  startList.add(buttonList);
  scene.add(startList);

  scene.onLoad = () => {
    buttonList.elements = [];

    if ((Game.instance.currentLvl || Game.instance.treatCount) && Game.instance.currentLvl < 6) {
      const continueButton = new UiButton(0, 0, 'Continue', [true, false]);
      continueButton.onClick = () => {
        Game.instance.restart(Game.instance.currentLvl);
      };
      buttonList.add(continueButton);
    }
    if (Game.instance.currentLvl) {
      const levelButton = new UiButton(0, 0, 'Load level', [true, false]);
      levelButton.onClick = () => {
        Game.instance.scenes[levelSym] = getLevelScene();
        Game.instance.loadScene(levelSym);
      };
      buttonList.add(levelButton);
    }

    const newGameButton = new UiButton(0, 0, 'New Game', [true, false]);
    newGameButton.onClick = () => {
      Game.instance.hasSeenIntro = false;
      Game.instance.treatFound = [];
      localStorage.setItem(leveltLocalStorageKey, '0');
      Game.instance.restart();
    };

    buttonList.add(newGameButton);
    scene.update();
  };
  return scene;
}
