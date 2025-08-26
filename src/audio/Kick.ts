import { Instrument } from './Instrument';

export class Kick extends Instrument {
  audioContext: AudioContext;
  targetNode: AudioNode;
  volume: number;

  constructor(audioContext: AudioContext, targetNode: AudioNode, volume: number) {
    super(audioContext, targetNode);
    this.volume = volume;
  }
  playNote(time: number) {
    const instrumentVolume = this.audioContext.createGain();
    instrumentVolume.gain.setValueAtTime(this.volume, time);
    instrumentVolume.connect(this.targetNode);

    const osc = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gainOsc = this.audioContext.createGain();
    const gainOsc2 = this.audioContext.createGain();

    const filterNode = this.audioContext.createBiquadFilter();
    filterNode.frequency.setValueAtTime(265, time);
    osc.type = 'triangle';
    osc2.type = 'sine';

    gainOsc.gain.setValueAtTime(1, time);
    gainOsc.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    gainOsc2.gain.setValueAtTime(1, time);
    gainOsc2.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.5);

    osc2.frequency.setValueAtTime(50, time);
    osc2.frequency.exponentialRampToValueAtTime(0.001, time + 0.5);

    osc.connect(gainOsc);
    osc2.connect(gainOsc2);
    gainOsc.connect(filterNode);
    gainOsc2.connect(filterNode);

    filterNode.connect(instrumentVolume);

    const nodes = [osc, osc2];
    nodes.forEach((node) => node.start(time));
    nodes.forEach((node) => node.stop(time + 0.5));

    return nodes;
  }
}
