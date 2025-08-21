import { textImage, btnImage } from './assets';

const buttonHeight = 13;
const buttonWidth = 13;
const sideWidth = Math.floor(buttonWidth / 2);

const textHeight = 7;
const textWidth = 5;
const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#-/ ';

export function displayString(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  str: string,
  magnifiying: number = 3,
) {
  ctx.save();
  str
    .toUpperCase()
    .split('')
    .forEach((c, i) => {
      let index = text.indexOf(c);
      ctx.drawImage(
        textImage,
        0 + index * textWidth,
        0,
        5,
        textHeight,
        x + i * textWidth * magnifiying + i * magnifiying,
        y,
        textWidth * magnifiying,
        textHeight * magnifiying,
      );
    });
  ctx.restore();
}

export function getTextRealSizes(str: string, magnifiying: number) {
  return {
    // width: (str.length * textWidth + (str.length - 1)) * magnifiying,
    width: str.length * textWidth * magnifiying + str.length * magnifiying,
    height: textHeight * magnifiying,
  };
}

export function getButtonRealSizes(str: string, magnifiying: number) {
  return {
    width: getTextRealSizes(str, magnifiying - 2).width + (sideWidth * 2 + 2) * magnifiying,
    height: buttonHeight * magnifiying,
  };
}
