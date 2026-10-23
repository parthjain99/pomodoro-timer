import { useEffect, useState } from 'react';
import { PauseIcon, PlayIcon, SkipIcon } from './Icons.jsx';

// Small always-on-top window. It only displays the main window's timer and forwards button presses back.
export default function MiniTimer() {
  const [timer, setTimer] = useState({ clock: '--:--', phase: '', running: false });

  useEffect(() => {
    document.body.classList.add('mini');
    const off = window.pomodoro?.onState((state) => setTimer(state));
    window.pomodoro?.requestState();
    return () => {
      off?.();
      document.body.classList.remove('mini');
    };
  }, []);

  const send = (command) => window.pomodoro?.sendCommand(command);

  return (
    <div className="mini">
      <button className="mini-close" onClick={() => window.pomodoro?.toggleMini()} aria-label="Close mini timer" title="Close">
        ×
      </button>
      <div className="mini-phase">{timer.phase}</div>
      <div className="mini-clock">{timer.clock}</div>
      <div className="mini-controls">
        <button onClick={() => send('toggle')} aria-label={timer.running ? 'Pause' : 'Start'}>
          {timer.running ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={() => send('skip')} aria-label="Skip">
          <SkipIcon />
        </button>
      </div>
    </div>
  );
}
