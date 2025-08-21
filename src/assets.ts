import treat from '/assets/treat.webp';
import text from '/assets/text.webp';
import cat from '/assets/cat.webp';
import cardboard from '/assets/cardboard.webp';
import btn from '/assets/btn.webp';

export const treatImage = new Image(20, 20);
treatImage.src = treat;

export const textHeight = 7;
export const textWidth = 5;

export const textImage = new Image(200, textHeight);
textImage.src = text;

export const catImage = new Image(20, 21 * 20);
catImage.src = cat;

export const cardBoardImage = new Image(40, 40);
cardBoardImage.src = cardboard;

export const buttonHeight = 13;
export const buttonWidth = 13;
export const buttonSideWidth = Math.floor(buttonWidth / 2);

export const btnImage = new Image(buttonWidth, buttonHeight);
btnImage.src = btn;
