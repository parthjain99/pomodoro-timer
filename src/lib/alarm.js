// Alarm sound generated with the Web Audio API, so no audio file is needed.
let ctx = null;

// Call from a user gesture (e.g. the Start button) so the browser allows audio.
export function primeAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
  } catch {
    // audio unavailable
  }
}

// One short, quiet click (about 20 ms). volume is 0-100.
export function playTick() {
  try {
    primeAudio();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.15, t0 + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.02);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.025);
  } catch {
    // audio unavailable
  }
}

// Three short beeps.
export function playAlarm() {
  try {
    primeAudio();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    [0, 0.3, 0.6].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, t0 + offset);
      gain.gain.exponentialRampToValueAtTime(0.4, t0 + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + offset + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0 + offset);
      osc.stop(t0 + offset + 0.25);
    });
  } catch {
    // audio unavailable
  }
}
