import { treatImage } from '../assets';
import { darkBackground } from '../config';
import { UiList } from '../ui-elements/UiList';
import { UiScene } from '../ui-elements/Scene';
import { UiText } from '../ui-elements/UiText';
import { UiImage } from '../ui-elements/UiImage';
import { UiButton } from '../ui-elements/UiButton';
import Game from '../Game';
import { startSym } from '.';

// End Scene
export const endScene = new UiScene();
const endList = new UiList(0, 0, [true, true], 'column');
endList.inverted = 1;

const endMessage = new UiText(0, 0, 'GG WP', 12, [true, false]);
const restartButton = new UiButton(0, 0, 'Back to menu', [true, false]);

restartButton.onClick = () => {
  Game.instance.loadScene(startSym);
};
restartButton.inverted = 0;

const treatLayout = new UiList(0, 0, [true, false], 'row');
const treatUiImage2 = new UiImage(8, 6, 3, treatImage, [false, true]);

export const treatEndCounter = new UiText(0, 16, '0', 5, [false, true]);
treatLayout.add(treatUiImage2);
treatUiImage2.inverted = 0;
treatLayout.add(treatEndCounter);
endList.add(endMessage);
endList.add(treatLayout);
endList.add(restartButton);
endScene.add(endList);
