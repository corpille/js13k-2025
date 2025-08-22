import { startSym } from '.';
import { treatImage } from '../assets';
import { levels, lightBackground } from '../config';
import Game from '../Game';
import { UiScene } from '../ui-elements/Scene';
import { UiButton } from '../ui-elements/UiButton';
import { UiList } from '../ui-elements/UiList';
import { UiText } from '../ui-elements/UiText';

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
      level.name,
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
