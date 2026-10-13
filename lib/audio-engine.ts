class LoFiAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private synthGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  
  private rainSource: AudioBufferSourceNode | null = null;
  private vinylSource: AudioBufferSourceNode | null = null;
  private activeAmbientType: 'none' | 'rain' | 'vinyl' | 'coffee' = 'none';

  private isChordPlaying: boolean = false;
  private currentOscillators: OscillatorNode[] = [];
  private chordTimer: number | null = null;
  private chordStep: number = 0;

  // Lofi jazzy 7th/9th chords: Dm9 -> G13 -> Cmaj9 -> Am7
  private chordProgressions = [
    [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
    [98.00, 123.47, 174.61, 220.00, 329.63],  // G13
    [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
    [110.00, 130.81, 164.81, 196.00, 246.94], // Am9
  ];

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.synthGain = this.ctx.createGain();
      this.synthGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.synthGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    } catch (err) {
      console.warn('Web Audio API not supported', err);
    }
  }

  public async startLoFiTrack(bpm: number = 75) {
    if (typeof window === 'undefined') return;
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.stopLoFiTrack();
    this.isChordPlaying = true;
    this.chordStep = 0;

    const intervalMs = Math.max(2200, (60 / bpm) * 4 * 1000);
    this.playNextLoFiChord();

    this.chordTimer = window.setInterval(() => {
      if (this.isChordPlaying) {
        this.playNextLoFiChord();
      }
    }, intervalMs);
  }

  private playNextLoFiChord() {
    if (!this.ctx || !this.synthGain) return;
    this.stopCurrentOscillators();

    const chord = this.chordProgressions[this.chordStep % this.chordProgressions.length];
    this.chordStep++;

    const now = this.ctx.currentTime;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450 + Math.random() * 80, now);
    filter.Q.setValueAtTime(1.5, now);
    filter.connect(this.synthGain);

    const chordGain = this.ctx.createGain();
    chordGain.gain.setValueAtTime(0.001, now);
    chordGain.gain.exponentialRampToValueAtTime(0.25, now + 0.35);
    chordGain.gain.exponentialRampToValueAtTime(0.08, now + 2.5);
    chordGain.connect(filter);

    chord.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      const detune = (Math.random() - 0.5) * 14;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      osc.connect(chordGain);
      osc.start(now);
      this.currentOscillators.push(osc);
    });
  }

  private stopCurrentOscillators() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.currentOscillators.forEach((osc) => {
      try {
        osc.stop(now + 0.2);
      } catch {}
    });
    this.currentOscillators = [];
  }

  public stopLoFiTrack() {
    this.isChordPlaying = false;
    if (this.chordTimer !== null) {
      clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    this.stopCurrentOscillators();
  }

  public setMasterVolume(val: number) {
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
  }

  public setAmbientVolume(val: number) {
    if (!this.ambientGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    this.ambientGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
  }

  public setAmbientSound(type: 'none' | 'rain' | 'vinyl' | 'coffee') {
    if (typeof window === 'undefined') return;
    this.initContext();
    if (!this.ctx || !this.ambientGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.rainSource) {
      try { this.rainSource.stop(); } catch {}
      this.rainSource = null;
    }
    if (this.vinylSource) {
      try { this.vinylSource.stop(); } catch {}
      this.vinylSource = null;
    }

    this.activeAmbientType = type;
    if (type === 'none') return;

    const buffer = this.createNoiseBuffer(type);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    } else if (type === 'vinyl') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.8, this.ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    }

    source.connect(filter);
    filter.connect(this.ambientGain);
    source.start();

    if (type === 'rain') this.rainSource = source;
    if (type === 'vinyl') this.vinylSource = source;
    if (type === 'coffee') this.rainSource = source;
  }

  private createNoiseBuffer(type: 'rain' | 'vinyl' | 'coffee'): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not initialized');
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 3;
    const buffer = this.ctx.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        const pink = (lastOut + 0.03 * white) / 1.03;
        lastOut = pink;

        if (type === 'vinyl') {
          const cracklePop = Math.random() > 0.997 ? (Math.random() - 0.5) * 1.8 : 0;
          data[i] = (pink * 0.12) + cracklePop;
        } else if (type === 'rain') {
          data[i] = pink * 0.45;
        } else {
          data[i] = pink * 0.3;
        }
      }
    }
    return buffer;
  }
}

let engineInstance: LoFiAudioEngine | null = null;

export function getAudioEngine(): LoFiAudioEngine {
  if (typeof window === 'undefined') {
    return new LoFiAudioEngine();
  }
  if (!engineInstance) {
    engineInstance = new LoFiAudioEngine();
  }
  return engineInstance;
}
