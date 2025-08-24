import { gameSym } from '.';
import { darkBackground } from '../config';
import Game from '../Game';
import { slowDisplayText } from '../text-utils';
import { UiScene } from '../ui-elements/Scene';
import { UiButton } from '../ui-elements/UiButton';
import { UiList } from '../ui-elements/UiList';
import { UiText } from '../ui-elements/UiText';
import { sleep } from '../utils';

const msg = `Once upon a time, Nyx, goddess of the night
grew tired of her husband Darkness.
She always used to rely on him to do anything
and this was not suiting her anymore.
So, one morning, disguised as a cat
She sneaked her way out and left the heavens
only to be followed by a looming darkness`;

export function getStartLoreScene() {
  const startLoreScene = new UiScene(darkBackground, true);
  const list = new UiList(0, 0, [true, true]);

  const button = new UiButton(0, 0, 'Leave', [true, false]);

  button.onClick = () => {
    Game.instance.loadScene(gameSym);
  };
  startLoreScene.add(list);

  startLoreScene.onLoad = async () => {
    list.elements = [];
    await slowDisplayText(list, msg);
    list.add(button);
  };
  return startLoreScene;
}
