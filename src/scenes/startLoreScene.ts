import { gameSym } from '.';
import { darkBackground } from '../config';
import Game from '../Game';
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
only to be followed by a darkness`;

export function getStartLoreScene() {
  const startLoreScene = new UiScene(darkBackground, true);
  const list = new UiList(0, 0, [true, true]);

  const editText = (textEl: UiText, str: string) => {
    return new Promise((resolve) => {
      if (!str.length) {
        return resolve(1);
      }
      textEl.text = textEl._text + str[0];
      setTimeout(() => {
        editText(textEl, str.slice(1));
      }, 100);
    });
  };

  const button = new UiButton(0, 0, 'Leave Heaven', [true, false]);

  button.onClick = () => {
    Game.instance.loadScene(gameSym);
  };
  startLoreScene.add(list);

  startLoreScene.onLoad = async () => {
    const lines = msg.split('\n');
    for (const line of lines) {
      const text = new UiText(0, 0, '', 3, [true, false]);
      text.inverted = 1;
      list.add(text);
      for (let i = 0; i < line.length; i++) {
        text.text = text._text + line[i];
        await sleep(60);
      }
    }
    list.add(button);
  };
  return startLoreScene;
}
