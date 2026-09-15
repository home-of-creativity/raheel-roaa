type IntroAudio = {
  start: () => void;
  impact: () => void;
  stop: () => void;
};

function makeNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.4;
  }
  return buffer;
}

export function createIntroAudio(): IntroAudio {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let wind: AudioBufferSourceNode | null = null;
  let engine: OscillatorNode | null = null;
  let started = false;

  const disconnect = () => {
    try {
      wind?.stop();
    } catch {
      /* already stopped */
    }
    try {
      engine?.stop();
    } catch {
      /* already stopped */
    }
    wind?.disconnect();
    engine?.disconnect();
    master?.disconnect();
    wind = null;
    engine = null;
    master = null;
  };

  const start = () => {
    if (started) return;
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    started = true;

    wind = ctx.createBufferSource();
    wind.buffer = makeNoiseBuffer(ctx, 3);
    wind.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 680;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.18;
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);
    wind.start();

    engine = ctx.createOscillator();
    engine.type = "sine";
    engine.frequency.value = 78;
    const engineFilter = ctx.createBiquadFilter();
    engineFilter.type = "lowpass";
    engineFilter.frequency.value = 140;
    const engineGain = ctx.createGain();
    engineGain.gain.value = 0.08;
    engine.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(master);
    engine.start();

    master.gain.exponentialRampToValueAtTime(0.7, ctx.currentTime + 1.2);
    void ctx.resume();
  };

  const impact = () => {
    if (!ctx || !master || !started) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  };

  const stop = () => {
    if (!ctx || !master) {
      started = false;
      return;
    }

    const closing = ctx;
    try {
      const now = closing.currentTime;
      const current = Math.max(master.gain.value, 0.0001);
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(current, now);
      master.gain.linearRampToValueAtTime(0, now + 0.12);
    } catch {
      /* ignore */
    }

    disconnect();
    started = false;
    ctx = null;
    void closing.close();
  };

  return { start, impact, stop };
}
