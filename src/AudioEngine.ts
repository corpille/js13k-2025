import { Synthetizer } from './audio/Synthetizer';
import { bassConfig, lead1Config, lead2Config, minAttack, subConfig } from './audio/intrument-config';
import { Kick } from './audio/Kick';
import { Instrument } from './audio/Instrument';
import { Snare } from './audio/Snare';
import { volumeLocalStorageKey } from './config';

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

const melody = {
  name: 'main',
  loop: loop,
  loopPoint: 0,
  loopLength: 2,
};

const BPM = 100;
export const loopLength = (16 * 60000) / BPM;

export default class AudioEngine {
  static _instance: AudioEngine;
  isPaused: boolean;
  audioContext: AudioContext;
  mainGainNode: GainNode;
  iterators: { [id: string]: number } = {};
  timeoutIds: { [id: string]: number } = {};
  timers: { [id: string]: number } = {};
  resumeTimers: { [id: string]: number } = {};
  intruments: { [id: string]: Instrument[] } = {};
  audioNodes: (AudioScheduledSourceNode | AudioBufferSourceNode)[] = [];

  _volume: number = 0.5;

  get volume(): number {
    this._volume = parseFloat(localStorage.getItem(volumeLocalStorageKey) ?? '0.5');

    return this._volume;
  }

  set volume(value: number) {
    this._volume = value;
    localStorage.setItem(volumeLocalStorageKey, this._volume.toString());
    this.mainGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.mainGainNode.gain.value = this.volume;
  }

  get isPlaying() {
    return this.timeoutIds[melody.name] !== undefined;
  }

  constructor() {
    this.audioContext = new AudioContext();

    this.mainGainNode = this.audioContext.createGain();
    this.mainGainNode.connect(this.audioContext.destination);
    this.mainGainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

    this.intruments.sub = [new Synthetizer(this.audioContext, this.mainGainNode, subConfig)];
    this.intruments.bass = [new Synthetizer(this.audioContext, this.mainGainNode, bassConfig)];
    this.intruments.kick = [new Kick(this.audioContext, this.mainGainNode, 0.4)];
    this.intruments.snare = [new Snare(this.audioContext, this.mainGainNode, 0.04)];
    this.intruments.lead = [
      new Synthetizer(this.audioContext, this.mainGainNode, lead1Config),
      new Synthetizer(this.audioContext, this.mainGainNode, lead2Config),
    ];
  }

  static get instance(): AudioEngine {
    if (!AudioEngine._instance) {
      AudioEngine._instance = new AudioEngine();
    }
    return AudioEngine._instance;
  }

  playBar() {
    if (!this.iterators[melody.name]) {
      this.iterators[melody.name] = 0;
    }
    if (this.iterators[melody.name] === melody.loopLength) {
      this.iterators[melody.name] = melody.loopPoint ?? 0;
    }
    this.audioNodes = [];
    for (const [instrument, notes] of Object.entries(melody.loop)) {
      let delay = 0;
      notes[this.iterators[melody.name]].forEach((note: string) => {
        const [sym, dur] = note.split(':');
        const duration = parseFloat(dur ?? '0');
        if (sym !== '-') {
          const [key, octave] = sym.split('');
          const time = this.audioContext.currentTime + (delay * 60) / BPM;
          this.audioNodes.push(
            ...this.intruments[instrument].flatMap((instr: Instrument) =>
              instr.playNote(time, (duration * 60) / BPM, key, parseInt(octave)),
            ),
          );
        }
        delay += duration;
      });
    }
    this.iterators[melody.name]++;

    this.timers[melody.name] = Date.now() + loopLength;
    this.timeoutIds[melody.name] = setTimeout(() => {
      this.playBar();
    }, loopLength);
  }

  pause() {
    if (!this.isPaused) {
      this.isPaused = true;

      if (this.audioContext.state === 'running') {
        Object.entries(this.timeoutIds).forEach(([name, pid]) => {
          clearTimeout(pid);
          this.resumeTimers[name] = this.timers[melody.name] - Date.now();
        });
        this.audioContext.suspend();
      }
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      if (this.audioContext.state === 'suspended') {
        Object.entries(this.resumeTimers).forEach(([name, length]) => {
          this.timeoutIds[name] = setTimeout(() => {
            this.playBar();
          }, length);
        });
        this.audioContext.resume();
      }
    }
  }

  playBgMusic() {
    this.resume();
    this.iterators[melody.name] = 0;
    this.playBar();
  }

  async stopBgMusic() {
    this.mainGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.audioNodes.forEach((audioNode) => audioNode.stop(0));
    Object.values(this.timeoutIds).forEach(clearTimeout);
    this.timeoutIds = {};
  }
}
