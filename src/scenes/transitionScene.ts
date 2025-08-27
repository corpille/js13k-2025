import { gameSym } from '.';
import { darkBackground } from '../config';
import Game from '../Game';
import { slowDisplayText } from '../text-utils';
import { UiScene } from '../ui-elements/Scene';
import { UiButton } from '../ui-elements/UiButton';
import { UiList } from '../ui-elements/UiList';

export function getTransitionScene(msg: string) {
  const scene = new UiScene(true);
  const list = new UiList(0, 0, [true, true]);

  const button = new UiButton(0, 0, 'Continue', [true, false]);

  button.onClick = () => {
    Game.instance.loadScene(gameSym);
    Game.instance.reset();
  };
  scene.add(list);

  scene.onLoad = async () => {
    list.elements = [];
    await slowDisplayText(list, msg);
    list.add(button);
    Game.instance.currentLvl++;
  };
  return scene;
}
