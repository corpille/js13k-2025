import { textImage, btnImage } from './assets';

const textHeight = 7;
const textWidth = 5;

export function displayString(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  str: string,
  magnifiying: number = 3,
) {
  str
    .toUpperCase()
    .split('')
    .forEach((c, i) => {
      const code = c.charCodeAt(0);
      let index = 0;
      if (code >= 65) {
        index = code - 65;
      } else if (code === 35) {
        index = 36;
      } else if (code === 45) {
        index = 37;
      } else if (code === 32) {
        index = 38;
      } else {
        index = code - 48 + 26;
      }
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
}

const buttonHeight = 13;
const buttonWidth = 13;
const sideWidth = Math.floor(buttonWidth / 2);

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
