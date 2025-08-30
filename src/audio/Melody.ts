export interface Melody {
  loop: { [name: string]: string[][] };
  loopPoint: number;
  loopLength: number;
}
