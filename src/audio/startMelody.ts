const loop: { [name: string]: string[][] } = {
  sub: [['C2:16'], ['E2:16'], ['E2:16']],
  bass2: [
    ['C3,E3,G3:8', 'E3,G#3,B3:8'],
    ['E3,G3,B3:8', 'A3,C4,E4:8'],
    ['E3,G3,B3:8', 'G3,B3,D4:8'],
  ],
};

export const startMelody = {
  loop: loop,
  loopPoint: 0,
  loopLength: 3,
};
