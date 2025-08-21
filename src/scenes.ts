import { treatImage } from './assets';
import { gridRealHeight, squareSize } from './config';
import { UiList } from './ui-elements/UiList';
import { UiScene } from './ui-elements/Scene';
import { UiText } from './ui-elements/UiText';
import { UiImage } from './ui-elements/UiImage';
import { UiButton } from './ui-elements/UiButton';

// Start Scene
const startScene = new UiScene('#F4F0DB');
const startList = new UiList(0, 0, [true, true]);
const title = new UiText(0, 0, 'Untitled Game', 12, [true, false]);
const startButton = new UiButton(0, 0, 'Play', 5, [true, false]);
startList.add(title);
startList.add(startButton);
startScene.add(startList);

// Game Scene
const gameScene = new UiScene();
const treatUiImage = new UiImage(8, 6, 2, treatImage);
const treatCounter = new UiText(treatUiImage.x + treatUiImage.getRealSize().width, 16, '0', 3);
gameScene.add(treatCounter);
gameScene.add(treatUiImage);

// End Scene
const endScene = new UiScene('#1d1d21');
const endList = new UiList(0, 0, [true, true], 'column', 20);
endList.inverted = 1;
const endMessage = new UiText(0, 0, 'GG WP', 12, [true, false]);
const restartButton = new UiButton(
  0,
  Math.round((gridRealHeight - title.height) / 2) + title.height + 30,
  'Play Again',
  5,
  [true, false],
);
const treatLayout = new UiList(0, 0, [true, false], 'row', 0);
const treatUiImage2 = new UiImage(8, 6, 3, treatImage, [false, true]);

const treatEndCounter = new UiText(0, 16, '0', 5, [false, true]);
treatLayout.add(treatUiImage2);
treatUiImage2.inverted = 0;
treatLayout.add(treatEndCounter);
endList.add(endMessage);
endList.add(treatLayout);
endList.add(restartButton);
endScene.add(endList);

export { startScene, gameScene, endScene, startButton, restartButton, treatCounter, treatEndCounter };
