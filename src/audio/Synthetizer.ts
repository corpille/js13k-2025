import { Instrument } from './Instrument';
import { notesTable } from './notesTable';

interface Enveloppe {
  attack: number;
  release: number;
}

export interface SynthConfig {
  volume: number;
  type: OscillatorType;
  unisson: {
    amount: number;
    percent: number;
  };
  enveloppe: Enveloppe;
  filter: {
    cutoff: number; // in semitone
    enveloppeShift?: number; // in semitone
    enveloppe?: Enveloppe;
  };
}

export class Synthetizer extends Instrument {
  audioContext: AudioContext;
  targetNode: AudioNode;
  synthConfig: SynthConfig;
  oscillators: OscillatorNode[];

  constructor(audioContext: AudioContext, targetNode: AudioNode, synthConfig: SynthConfig) {
    super(audioContext, targetNode);
    this.synthConfig = synthConfig;
  }

  playNote(time: number, duration: number, key: string, octave: number) {
    const instrumentVolume = this.audioContext.createGain();
    instrumentVolume.gain.setValueAtTime(this.synthConfig.volume, time);
    instrumentVolume.connect(this.targetNode);

    const node = this.createSynth(time, duration, key, octave);
    node.connect(instrumentVolume);

    this.oscillators.forEach((o) => o.start(time));
    this.oscillators.forEach((o) => o.stop(time + duration));
    return this.oscillators;
  }

  getUnissonTable(amount: number, percent: number): number[] {
    const values: number[] = Array.from({ length: Math.floor(amount / 2) }, (_, i) => percent / Math.pow(2, i));
    const result: number[] = values.sort((a, b) => a - b).reduce((acc, val) => [...acc, -val], [] as number[]);

    if (amount % 2 !== 0) {
      result.push(0);
    }

    result.push(...values);
    return result.sort((a, b) => a - b);
  }

  getShiftedNote(key: string, octave: number, shift: number) {
    const keys = Object.keys(notesTable[1]);
    const keyIndex = keys.indexOf(key);
    const toneShift = shift % 12;
    let octaveShift = (shift - toneShift) / 12;
    let newKey = (keyIndex + toneShift) % keys.length;
    if (keyIndex + toneShift < 0) {
      octaveShift--;
    } else if (keyIndex + toneShift > keys.length) {
      octaveShift++;
    }
    return {
      key: keys[newKey < 0 ? keys.length + newKey : newKey],
      octave: octave + octaveShift,
    };
  }

  createSynth(time: number, duration: number, key: string, octave: number) {
    const detune = this.getUnissonTable(this.synthConfig.unisson.amount, this.synthConfig.unisson.percent);

    const volume = this.audioContext.createGain();
    volume.gain.setValueAtTime(this.synthConfig.volume, time);
    const enveloppe = this.audioContext.createGain();
    this.oscillators = [];
    for (let i = 0; i < this.synthConfig.unisson.amount; i++) {
      const osc = this.audioContext.createOscillator();
      osc.type = this.synthConfig.type;
      osc.frequency.setValueAtTime(notesTable[octave][key], time);
      osc.detune.setValueAtTime(detune[i], time);
      osc.connect(enveloppe);
      this.oscillators.push(osc);
    }

    const filter = this.audioContext.createBiquadFilter();
    const { key: fKey, octave: fOctave } = this.getShiftedNote(key, octave, this.synthConfig.filter.cutoff);

    filter.frequency.setValueAtTime(notesTable[fOctave][fKey], time);
    if (this.synthConfig.filter.enveloppe && this.synthConfig.filter.enveloppeShift) {
      const { key: sKey, octave: sOctave } = this.getShiftedNote(fKey, fOctave, this.synthConfig.filter.enveloppeShift);

      filter.frequency.linearRampToValueAtTime(
        notesTable[sOctave][sKey],
        time + this.synthConfig.filter.enveloppe.attack,
      );
      filter.frequency.linearRampToValueAtTime(
        notesTable[fOctave][fKey],
        time + this.synthConfig.filter.enveloppe.release,
      );
    }

    const hold = duration - this.synthConfig.enveloppe.release;

    enveloppe.gain.cancelScheduledValues(time);
    enveloppe.gain.setValueAtTime(0, time);
    enveloppe.gain.linearRampToValueAtTime(0.1, time + this.synthConfig.enveloppe.attack);
    enveloppe.gain.linearRampToValueAtTime(0.1, time + hold);
    enveloppe.gain.linearRampToValueAtTime(0, time + hold + this.synthConfig.enveloppe.release);
    enveloppe.connect(filter);

    return filter;
  }
}
