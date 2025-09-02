import { gameSym } from '.';
import Game from '../Game';
import { UiScene } from '../ui-elements/Scene';
import { slowDisplayText } from '../ui-elements/text-animation';
import { UiButton } from '../ui-elements/UiButton';
import { UiList } from '../ui-elements/UiList';
const msg = `Once upon a time, Nyx, goddess of the night
grew tired of her husband Darkness.
She always used to rely on him to do anything
and this was not suiting her anymore.
So, one morning, disguised as a cat
She sneaked her way out and left the heavens
only to be followed by a looming darkness`;

export function getStartLoreScene() {
  const startLoreScene = new UiScene(true);
  const list = new UiList(0, 0, [true, true]);

  const button = new UiButton(0, 0, 'Leave', [true, false]);

  button.onClick = () => {
    Game.instance.started = true;
    Game.instance.loadScene(gameSym);
  };
  startLoreScene.add(list);

  startLoreScene.onLoad = async () => {
    startLoreScene.autoRefresh = true;
    list.elements = [];
    list.inverted = 1;
    await slowDisplayText(list, msg);
    startLoreScene.autoRefresh = false;
    list.add(button);
  };
  return startLoreScene;
}
