import { SynthConfig } from './Synthetizer';

export const minAttack = 0.008;

export const subConfig: SynthConfig = {
  volume: 0.7,
  type: 'sawtooth',
  enveloppe: {
    attack: 0.5,
    release: 0.5,
  },
  filter: {
    cutoff: -12,
    enveloppeShift: 12,
    enveloppe: {
      attack: 0.5,
      release: 0.5,
    },
  },
  unisson: {
    amount: 7,
    percent: 20,
  },
};

export const bassConfig: SynthConfig = {
  volume: 0.2,
  type: 'sawtooth',
  enveloppe: {
    attack: minAttack,
    release: 0.1,
  },
  filter: {
    cutoff: 0,
    enveloppeShift: 24,
    enveloppe: {
      attack: minAttack,
      release: 1,
    },
  },
  unisson: {
    amount: 7,
    percent: 20,
  },
};

export const bass2Config: SynthConfig = {
  volume: 0.2,
  type: 'sawtooth',
  enveloppe: {
    attack: 1,
    release: 1,
  },
  filter: {
    cutoff: 12,
    enveloppeShift: 0,
  },
  unisson: {
    amount: 3,
    percent: 10,
  },
};

export const lead1Config: SynthConfig = {
  volume: 1,
  type: 'sine',
  enveloppe: {
    attack: 0.075,
    release: 0.089,
  },
  filter: {
    cutoff: -12,
    enveloppeShift: 12,
    enveloppe: {
      attack: 0.075,
      release: 0.089,
    },
  },
  unisson: {
    amount: 3,
    percent: 10,
  },
};

export const lead2Config: SynthConfig = {
  volume: 0.5,
  type: 'sawtooth',
  enveloppe: {
    attack: minAttack,
    release: minAttack,
  },
  filter: {
    cutoff: 0,
  },
  unisson: {
    amount: 3,
    percent: 10,
  },
};
