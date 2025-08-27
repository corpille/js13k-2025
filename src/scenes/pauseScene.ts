import { gameSym, startSym } from '.';
import { treatImage } from '../assets';
import AudioEngine from '../AudioEngine';
import { darkBackground, leveltLocalStorageKey } from '../config';
import Game from '../Game';
import { UiScene } from '../ui-elements/Scene';
import { UiButton } from '../ui-elements/UiButton';
import { UiImage } from '../ui-elements/UiImage';
import { UiList } from '../ui-elements/UiList';
import { UiText } from '../ui-elements/UiText';

export const pauseScene = new UiScene(true, `${darkBackground}ba`);
const scenelist = new UiList(0, 0, [true, true]);

const title = new UiText(0, 0, 'Pause', 3, [true, false]);
title.inverted = 1;
scenelist.add(title);

const infoList = new UiList(0, 0, [true, false], 'row');
scenelist.add(infoList);

const resumeButton = new UiButton(0, 0, 'Resume', [true, false]);
resumeButton.onClick = () => {
  Game.instance.unPause();
};
scenelist.add(resumeButton);

const quitButton = new UiButton(0, 0, 'Quit', [true, false]);
quitButton.onClick = () => {
  AudioEngine.instance.stopBgMusic();
  Game.instance.started = false;
  Game.instance._currentLvl = parseInt(localStorage.getItem(leveltLocalStorageKey) ?? '0');
  Game.instance.reset();
  Game.instance.loadScene(startSym);
};
scenelist.add(quitButton);

pauseScene.add(scenelist);

pauseScene.onLoad = async () => {
  infoList.elements = [];
  const text = new UiText(0, 0, `Level ${Game.instance.currentLevel.name}`, 3, [false, true]);
  text.inverted = 1;

  const treatInfo = new UiList(0, 0, [false, true], 'row', 8);
  const treatUiImage = new UiImage(0, 0, 3, treatImage, [false, true]);
  const treatCounter = new UiText(0, 0, Game.instance.treatCount.toString(), 3, [false, true]);
  treatCounter.inverted = 1;
  infoList.add(text);
  treatInfo.add(treatUiImage);
  treatInfo.add(treatCounter);
  infoList.add(treatInfo);
  infoList.update();
};
