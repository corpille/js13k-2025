import treat from '/assets/treat.webp';
import text from '/assets/text.webp';
import cat from '/assets/cat.webp';
import cardboard from '/assets/cardboard.webp';
import btn from '/assets/btn.webp';

export const textMatcher = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#-/ .,';

export const treatImage = new Image(10, 10);
treatImage.src = treat;

export const imageTextHeight = 7;
export const imageTextWidth = 5;

export const textImage = new Image(textMatcher.length * imageTextWidth, imageTextHeight);
textImage.src = text;

export const catImage = new Image(20, 21 * 20);
catImage.src = cat;

export const cardBoardImage = new Image(40, 40);
cardBoardImage.src = cardboard;

export const buttonWidth = 15;
export const buttonHeight = 15;
export const buttonSideWidth = Math.floor(buttonWidth / 2);

export const btnImage = new Image(buttonWidth, buttonHeight);
btnImage.src = btn;
