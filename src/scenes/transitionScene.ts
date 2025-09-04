import { gameSym } from '.';
import { backgroundShift } from '../background';
import Game from '../Game';
import { slowDisplayText } from '../ui-elements/text-animation';
import { UiScene } from '../ui-elements/Scene';
import { UiButton } from '../ui-elements/UiButton';
import { UiList } from '../ui-elements/UiList';
import { UiText } from '../ui-elements/UiText';
import { getGridRealHeight } from '../config';

const defautlCallback = () => {
  Game.instance.currentLvl++;
  Game.instance.loadScene(gameSym);
  Game.instance.reset();
};

export function getTransitionScene(msg: string, btnLabel = 'Continue', callback = defautlCallback) {
  const scene = new UiScene(true);
  const list = new UiList(0, 0, [true, false]);
  const button = new UiButton(0, 0, btnLabel, [true, false]);

  msg.split('\n').forEach(() => list.add(new UiText(0, 0, '', 3, [true, false])));
  list.add(button);
  list.y = (getGridRealHeight() - list.getRealSize().height) / 2;

  button.onClick = callback;
  scene.add(list);

  scene.onLoad = async () => {
    scene.autoRefresh = true;
    list.inverted = Game.instance.currentLvl > backgroundShift ? 0 : 1;
    list.elements = [];
    await slowDisplayText(list, msg);
    scene.autoRefresh = false;
    list.add(button);
  };
  return scene;
}
