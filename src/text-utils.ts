import { textImage, textMatcher } from './assets';
import { UiList } from './ui-elements/UiList';
import { UiText } from './ui-elements/UiText';
import { sleep } from './utils';

const textHeight = 7;
const textWidth = 5;

export function displayString(ctx: CanvasRenderingContext2D, x: number, y: number, str: string, size: number = 3) {
  ctx.save();
  str
    .toUpperCase()
    .split('')
    .forEach((c, i) => {
      let index = textMatcher.indexOf(c);
      ctx.drawImage(
        textImage,
        0 + index * textWidth,
        0,
        5,
        textHeight,
        x + i * textWidth * size + i * size,
        y + (c === ',' ? size : 0),
        textWidth * size,
        textHeight * size,
      );
    });
  ctx.restore();
}

export function getTextRealSizes(str: string, size: number) {
  return {
    width: str.length * textWidth * size + (str.length - 1) * size,
    height: textHeight * size,
  };
}

export async function slowDisplayText(list: UiList, msg: string) {
  const lines = msg.split('\n');
  for (const line of lines) {
    const text = new UiText(0, 0, '', 3, [true, false]);
    text.inverted = 1;
    list.add(text);
    for (let i = 0; i < line.length; i++) {
      text.text = text._text + line[i];
      await sleep(30);
    }
  }
}
