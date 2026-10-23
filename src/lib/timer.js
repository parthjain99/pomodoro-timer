import { useCallback, useEffect, useRef, useState } from 'react';

export const DEFAULT_SETTINGS = {
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  cycleLen: 4,
  syncVideo: true,
  volume: 50,
  alarm: true,
  tick: false,
  defaultVideo: null,
};

export function phaseSeconds(settings, phase) {
  if (phase === 'focus') return settings.focusMin * 60;
  if (phase === 'short') return settings.shortMin * 60;
  return settings.longMin * 60;
}

export function formatClock(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const PHASE_LABEL = { focus: 'Focus', short: 'Short break', long: 'Long break' };

// Timer state machine. While running, time is derived from an end timestamp so the
// clock stays accurate even when the window is throttled. A phase never auto-starts:
// the timer stops at each boundary so the user decides when to continue.
export function useTimer(settings, { onFocusComplete, onPhaseEnd } = {}) {
  const [phase, setPhase] = useState('focus');
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(() => phaseSeconds(settings, 'focus'));
  const [endAt, setEndAt] = useState(null);
  const [completed, setCompleted] = useState(0); // focus sessions done in this cycle
  const [now, setNow] = useState(() => Date.now());

  const onFocusCompleteRef = useRef(onFocusComplete);
  onFocusCompleteRef.current = onFocusComplete;
  const onPhaseEndRef = useRef(onPhaseEnd);
  onPhaseEndRef.current = onPhaseEnd;

  const left = running && endAt !== null ? Math.max(0, Math.ceil((endAt - now) / 1000)) : remaining;

  // Keep the clock moving while running.
  useEffect(() => {
    if (!running) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running]);

  // Phase finished.
  useEffect(() => {
    if (!running || left > 0) return;
    onPhaseEndRef.current?.(phase);
    if (phase === 'focus') {
      const nextCompleted = completed + 1;
      const next = nextCompleted % settings.cycleLen === 0 ? 'long' : 'short';
      setCompleted(nextCompleted);
      onFocusCompleteRef.current?.(next);
      setPhase(next);
      setRemaining(phaseSeconds(settings, next));
    } else {
      setPhase('focus');
      setRemaining(phaseSeconds(settings, 'focus'));
    }
    setRunning(false);
    setEndAt(null);
    // settings is intentionally read at the moment of completion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, running]);

  // Changing durations while stopped updates the displayed time.
  useEffect(() => {
    if (!running) setRemaining(phaseSeconds(settings, phase));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.focusMin, settings.shortMin, settings.longMin]);

  const start = useCallback(() => {
    setEndAt(Date.now() + remaining * 1000);
    setNow(Date.now());
    setRunning(true);
  }, [remaining]);

  const pause = useCallback(() => {
    setRemaining(left);
    setEndAt(null);
    setRunning(false);
  }, [left]);

  const moveTo = useCallback(
    (nextPhase) => {
      setPhase(nextPhase);
      setRemaining(phaseSeconds(settings, nextPhase));
      setEndAt(null);
      setRunning(false);
    },
    [settings]
  );

  const skip = useCallback(() => moveTo(phase === 'focus' ? 'short' : 'focus'), [moveTo, phase]);
  const reset = useCallback(() => moveTo('focus'), [moveTo]);

  return { phase, running, left, completed, start, pause, skip, reset, goTo: moveTo };
}
