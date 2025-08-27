import { textImage, textMatcher } from './assets';
import { UiList } from './ui-elements/UiList';
import { UiText } from './ui-elements/UiText';
import { sleep } from './utils';

const textHeight = 7;
const textWidth = 5;

export function displayString(ctx: CanvasRenderingContext2D, x: number, y: number, str: string, size: number = 3) {
  ctx.save();
  str.split('').reduce((xOffset, c, i) => {
    let index = textMatcher.indexOf(c);
    const width = ".'".includes(c) ? 1 : ','.includes(c) ? 2 : textWidth;
    const offset = index * textWidth + Math.floor((textWidth - width) / 2);
    ctx.drawImage(
      textImage,
      0 + offset,
      0,
      width,
      textHeight,
      x + xOffset,
      y + (c === ',' ? size : 'gjpqy'.includes(c) ? (size * 4) / 2 : 0),
      width * size,
      textHeight * size,
    );
    return xOffset + width * size + size;
  }, 0);
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
    list.add(text);
    for (let i = 0; i < line.length; i++) {
      text.text = text._text + line[i];
      await sleep(0);
    }
  }
}
