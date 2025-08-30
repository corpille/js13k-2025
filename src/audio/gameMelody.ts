const kickRythm = ['X', '-:1.25', 'X', 'X:0.75', 'X', '-:1.25', 'X', 'X:0.75'];
const snareRythm = ['-:0.5', 'X', '-:1', 'X', '-:1', 'X', '-:1', 'X', '-:0.5'];

const kick = kickRythm.concat(kickRythm).concat(kickRythm).concat(kickRythm);
const snare = snareRythm.concat(snareRythm).concat(snareRythm).concat(snareRythm);

const loop: { [name: string]: string[][] } = {
  sub: [['D2:16'], ['C2:16']],
  bass: [
    ['D3:4', 'C3:0.5', 'D3:3.5', 'F3:0.5', 'D3:3:8', 'C3:0.5', 'D3:4'],
    ['C3:3', 'B2:0.5', 'C3:4', 'G3:0.5', 'F3:3', 'G3:0.5', 'E3:5'],
  ],
  kick: [kick, kick],
  snare: [snare, snare],
  lead: [
    ['E4:3', 'F4:0.5', 'E4:3', 'C4:0.5', 'D4:0.5', 'E4:0.5', 'D4:3', 'B3:0.5', 'C4:2.5', 'E4:1', 'D4:1'],
    ['B3:3', 'C4:0.5', 'B3:3', 'G3:0.5', 'A3:0.5', 'B3:0.5', 'A3:3', 'G3:0.5', 'A3:4.5'],
  ],
};

export const gameMelody = {
  loop: loop,
  loopPoint: 0,
  loopLength: 2,
};
