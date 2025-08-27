import { treatImage } from '../assets';
import { backgroundShift } from '../background';
import { getSquareSize } from '../config';
import Game from '../Game';
import { UiScene } from '../ui-elements/Scene';
import { UiImage } from '../ui-elements/UiImage';
import { UiList } from '../ui-elements/UiList';
import { UiText } from '../ui-elements/UiText';

export const gameScene = new UiScene(true, 'transparent');
const treatInfo = new UiList(
  () => Math.round(getSquareSize() / 2),
  () => Math.round(getSquareSize() / 2),
  [false, false],
  'row',
  8,
);
const treatUiImage = new UiImage(0, 0, 2, treatImage, [false, true]);
export const treatCounter = new UiText(0, 0, '0', 3, [false, true]);
treatInfo.add(treatUiImage);
treatInfo.add(treatCounter);
gameScene.add(treatInfo);

gameScene.onLoad = () => {
  treatCounter.inverted = Game.instance.currentLvl > backgroundShift ? 0 : 1;
};
