import { Instrument } from './Instrument';

export class Snare extends Instrument {
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
    const gainosc = this.audioContext.createGain();
    const filterGain = this.audioContext.createGain();

    filterGain.gain.setValueAtTime(1, time);
    filterGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    const filterNode = this.audioContext.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(7000, time);

    osc.type = 'triangle';
    osc.frequency.value = 100;

    gainosc.gain.value = 0;
    gainosc.gain.setValueAtTime(0, time);

    //Connections
    osc.connect(gainosc);
    gainosc.connect(filterNode);

    const node = this.audioContext.createBufferSource();
    const buffer = this.audioContext.createBuffer(1, 4096, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(100, time);
    filter.frequency.linearRampToValueAtTime(4000, time + 0.2);

    for (let i = 0; i < 4096; i++) {
      data[i] = Math.random();
    }

    node.buffer = buffer;
    node.loop = true;

    //Connections
    node.connect(filter);
    filter.connect(filterGain);
    filterGain.connect(filterNode);
    filterNode.connect(instrumentVolume);

    const nodes = [osc, node];
    nodes.forEach((node) => node.start(time));
    nodes.forEach((node) => node.stop(time + 0.2));

    return nodes;
  }
}
