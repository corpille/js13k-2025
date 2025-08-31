import { levelSym } from '.';
import AudioEngine from '../AudioEngine';
import { backgroundShift } from '../background';
import { gameName, levelLocalStorageKey, lightBackground } from '../config';
import Game from '../Game';
import { UiScene } from '../ui-elements/Scene';
import { UiButton } from '../ui-elements/UiButton';
import { UiList } from '../ui-elements/UiList';
import { UiText } from '../ui-elements/UiText';
import { getMuteStatus } from '../utils';
import { getLevelScene } from './levelScene';

export function getStartScene(): UiScene {
  const scene = new UiScene();

  const sceneList = new UiList(0, 0, [true, true], 'column', 50);

  const title = new UiText(0, 0, gameName, 12, [true, false]);
  sceneList.add(title);

  const author = new UiText(0, 0, 'A game by Corentin Pillet', 3, [true, false]);
  sceneList.add(author);

  const buttonList = new UiList(0, 0, [true, false]);
  sceneList.add(buttonList);
  scene.add(sceneList);

  scene.onLoad = () => {
    // AudioEngine.instance.playBgMusic('start');
    sceneList.inverted = Game.instance.currentLvl > backgroundShift ? 0 : 1;
    buttonList.elements = [];

    if ((Game.instance.currentLvl || Game.instance.treatCount) && Game.instance.currentLvl < 6) {
      const continueButton = new UiButton(0, 0, 'Continue', [true, false]);
      continueButton.onClick = () => {
        // AudioEngine.instance.stopBgMusic();
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
      // AudioEngine.instance.stopBgMusic();
      Game.instance.hasSeenIntro = false;
      Game.instance.treatFound = [];
      localStorage.setItem(levelLocalStorageKey, '0');
      Game.instance.restart();
    };
    buttonList.add(newGameButton);

    const muteButton = new UiButton(0, 0, getMuteStatus(), [true, false]);
    muteButton.onClick = () => {
      AudioEngine.instance.volume = AudioEngine.instance.volume ? 0 : 0.5;
      muteButton.text = getMuteStatus();
      muteButton.update();
    };
    buttonList.add(muteButton);

    scene.update();
  };
  return scene;
}
