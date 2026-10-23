import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_SETTINGS, PHASE_LABEL, formatClock, useTimer } from './lib/timer.js';
import { loadState, saveState } from './lib/storage.js';
import { playAlarm, playTick, primeAudio } from './lib/alarm.js';
import TaskPanel from './components/TaskPanel.jsx';
import VideoPanel from './components/VideoPanel.jsx';
import ProjectPanel from './components/ProjectPanel.jsx';
import Analytics from './components/Analytics.jsx';
import { sortDoneToBottom } from './lib/tasks.js';
import { useThemes, themeStyle } from './lib/themes.js';
import MiniTimer from './components/MiniTimer.jsx';
import Footer from './components/Footer.jsx';
import CookieNotice from './components/CookieNotice.jsx';
import logo from './assets/logo.png';
import { GearIcon, PauseIcon, PictureIcon, PlayIcon, ResetIcon, SkipIcon } from './components/Icons.jsx';

const MODES = [
  { phase: 'focus', label: 'Focus' },
  { phase: 'short', label: 'Short Break' },
  { phase: 'long', label: 'Long Break' },
];


const SHORTCUTS = [
  ['Space', 'Start / pause'],
  ['R', 'Reset'],
  ['S', 'Skip'],
  ['P', 'Mini timer'],
];

// Always keep the baseline video in the library, saved (starred).
const BASELINE_VIDEO_ID = 'vadHXNBy4jQ';
function withBaselineVideo(items) {
  if (items.some((i) => i.id === BASELINE_VIDEO_ID)) {
    return items.map((i) => (i.id === BASELINE_VIDEO_ID ? { ...i, saved: true } : i));
  }
  return [{ id: BASELINE_VIDEO_ID, title: '', saved: true, lastPlayed: 0 }, ...items];
}

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

function notify(title, body) {
  try {
    window.pomodoro?.notify?.(title, body);
  } catch {
    // A failed notification must never break the timer.
  }
}

// The mini timer window loads the same app with ?mini=1 and only shows the clock.
export default function App() {
  const isMini = new URLSearchParams(window.location.search).has('mini');
  return isMini ? <MiniTimer /> : <MainApp />;
}

function MainApp() {
  const saved = useMemo(loadState, []);

  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS, ...(saved.settings || {}) });
  const [tasks, setTasks] = useState(Array.isArray(saved.tasks) ? saved.tasks : []);
  const [selectedId, setSelectedId] = useState(saved.selectedId || null);
  const [projects, setProjects] = useState(Array.isArray(saved.projects) ? saved.projects : []);
  const [sessions, setSessions] = useState(Array.isArray(saved.sessions) ? saved.sessions : []);
  const [library, setLibrary] = useState(() => withBaselineVideo(Array.isArray(saved.library) ? saved.library : []));
  const [showSettings, setShowSettings] = useState(false);
  const [miniOpen, setMiniOpen] = useState(false);

  useEffect(() => {
    saveState({ settings, tasks, selectedId, projects, sessions, library });
  }, [settings, tasks, selectedId, projects, sessions, library]);

  // Each finished focus session: credit the selected task and log the session for analytics.
  const timer = useTimer(settings, {
    onFocusComplete: (next) => {
      const task = tasks.find((t) => t.id === selectedId) || null;
      setTasks((prev) => {
        const next = prev.map((t) => {
          if (t.id !== selectedId) return t;
          const pomos = t.pomos + 1;
          return { ...t, pomos, done: t.done || (settings.autoCheckTasks && pomos >= t.est) };
        });
        return settings.checkToBottom ? sortDoneToBottom(next) : next;
      });
      setSessions((prev) => [
        ...prev,
        {
          id: uid(),
          at: Date.now(),
          minutes: settings.focusMin,
          projectId: task?.projectId ?? null,
          taskText: task?.text ?? '',
        },
      ]);
      notify('Focus done', next === 'long' ? 'Time for a long break.' : 'Time for a short break.');
    },
    onPhaseEnd: () => {
      if (settings.alarm) playAlarm(settings.alarmRepeat);
    },
  });

  const { phase, running, left } = timer;
  const clock = formatClock(left);
  const phaseLabel = PHASE_LABEL[phase];

  // Ticking during focus, only in the last 10 seconds. Reads the volume and the remaining
  // time through refs so moving the slider or the clock does not restart the interval.
  const leftRef = useRef(left);
  leftRef.current = left;
  useEffect(() => {
    if (!running || phase !== 'focus' || !settings.tick) return undefined;
    let lastTicked = null;
    // Each remaining second from 10 down to 1 gets exactly one tick.
    const id = setInterval(() => {
      const remaining = leftRef.current;
      if (remaining <= 10 && remaining > 0 && remaining !== lastTicked) {
        lastTicked = remaining;
        playTick();
      }
    }, 100);
    return () => clearInterval(id);
  }, [running, phase, settings.tick]);

  useEffect(() => {
    document.title = `${clock} · ${phaseLabel}`;
  }, [clock, phaseLabel]);

  // Keep the mini timer window in step with this timer.
  const stateRef = useRef({});
  stateRef.current = { clock: String(clock), phase: String(phaseLabel), running: Boolean(running) };
  function pushState() {
    try {
      window.pomodoro?.sendState({ ...stateRef.current });
    } catch {
      // The mini window is optional; never let it break the timer.
    }
  }
  useEffect(() => {
    pushState();
  }, [clock, phaseLabel, running]);
  useEffect(() => {
    const off = window.pomodoro?.onResend(pushState);
    return () => off?.();
  }, []);

  // Keep the task card no taller than the timer card (it scrolls past that).
  useEffect(() => {
    const timerCard = document.querySelector('.timer-card');
    const row = document.querySelector('.app');
    if (!timerCard || !row) return undefined;
    const update = () => row.style.setProperty('--timer-h', `${timerCard.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(timerCard);
    return () => observer.disconnect();
  }, []);

  // The mini timer window only exists in the desktop app.
  const isDesktop = typeof window !== 'undefined' && Boolean(window.pomodoro);
  // Themes come from the website only; the desktop app always uses the default look.
  const themes = useThemes(!isDesktop);
  const activeTheme = isDesktop ? themes[0] : themes.find((t) => t.id === settings.theme) || themes[0];
  useEffect(() => {
    document.body.style.background = activeTheme.colors.bg;
    document.body.style.color = activeTheme.colors.text;
  }, [activeTheme]);

  function toggleMini() {
    if (!isDesktop) return;
    window.pomodoro?.toggleMini();
    setMiniOpen((open) => !open);
  }

  // Every control goes through here: buttons, keyboard shortcuts, and the mini window.
  function runCommand(command) {
    if (command === 'toggle') {
      if (running) {
        timer.pause();
      } else {
        primeAudio();
        timer.start();
      }
    } else if (command === 'reset') {
      timer.reset();
    } else if (command === 'skip') {
      timer.skip();
    } else if (command === 'mini') {
      toggleMini();
    }
  }

  const commandRef = useRef(runCommand);
  commandRef.current = runCommand;

  useEffect(() => {
    const off = window.pomodoro?.onCommand((command) => commandRef.current(command));
    return () => off?.();
  }, []);

  useEffect(() => {
    const off = window.pomodoro?.onPipClosed(() => setMiniOpen(false));
    return () => off?.();
  }, []);

  useEffect(() => {
    if (!showSettings) return undefined;
    const onEsc = (e) => { if (e.key === 'Escape') setShowSettings(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [showSettings]);

  useEffect(() => {
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;
      if (e.key === ' ') {
        // Let Space activate a focused button instead of also toggling the timer.
        if (tag === 'BUTTON') return;
        e.preventDefault();
        commandRef.current('toggle');
      } else if (e.key === 'r' || e.key === 'R') {
        commandRef.current('reset');
      } else if (e.key === 's' || e.key === 'S') {
        commandRef.current('skip');
      } else if (e.key === 'p' || e.key === 'P') {
        commandRef.current('mini');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Video -> timer: pressing play in the player starts a focus session, pausing it pauses the timer.
  function handleUserPlayback(playing) {
    if (playing && !running) timer.start();
    else if (!playing && running) timer.pause();
  }

  function updateSetting(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function deleteProject(id) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.map((t) => (t.projectId === id ? { ...t, projectId: null } : t)));
    setSessions((prev) => prev.map((s) => (s.projectId === id ? { ...s, projectId: null } : s)));
  }

  return (
    <div className={`app ${isDesktop ? 'desktop' : 'web'}`} style={themeStyle(activeTheme)}>
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src={logo} alt="" />
          Pomodoro
        </div>
        <button
          className="icon-btn"
          onClick={() => setShowSettings((s) => !s)}
          aria-label="Settings"
          title="Settings"
        >
          <GearIcon />
        </button>
      </header>

      {showSettings && (
        <div className="modal-backdrop" onClick={() => setShowSettings(false)}>
          <section className="card modal" role="dialog" aria-modal="true" aria-label="Settings" onClick={(e) => e.stopPropagation()}>
          <div className="card-header static modal-header">
            <span className="card-title">Settings</span>
            <button className="icon-btn" onClick={() => setShowSettings(false)} aria-label="Close settings" title="Close">×</button>
          </div>
          <div className="card-body settings-grid">
            <NumberField label="Focus (min)" value={settings.focusMin} min={1} max={120}
              onChange={(v) => updateSetting('focusMin', v)} />
            <NumberField label="Short break (min)" value={settings.shortMin} min={1} max={60}
              onChange={(v) => updateSetting('shortMin', v)} />
            <NumberField label="Long break (min)" value={settings.longMin} min={1} max={60}
              onChange={(v) => updateSetting('longMin', v)} />
            <NumberField label="Sessions before long break" value={settings.cycleLen} min={1} max={10}
              onChange={(v) => updateSetting('cycleLen', v)} />
            <label className="check-row">
              <input
                type="checkbox"
                checked={settings.alarm}
                onChange={(e) => updateSetting('alarm', e.target.checked)}
              />
              Alarm at the end of each phase
            </label>
            <label className="check-row">
              <input type="checkbox" checked={settings.autoStartBreaks} onChange={(e) => updateSetting('autoStartBreaks', e.target.checked)} />
              Auto start breaks
            </label>
            <label className="check-row">
              <input type="checkbox" checked={settings.autoStartPomodoros} onChange={(e) => updateSetting('autoStartPomodoros', e.target.checked)} />
              Auto start pomodoros
            </label>
            <NumberField label="Alarm repeat (1 to 5)" value={settings.alarmRepeat} min={1} max={5}
              onChange={(v) => updateSetting('alarmRepeat', v)} />
            <label className="check-row">
              <input type="checkbox" checked={settings.autoCheckTasks} onChange={(e) => updateSetting('autoCheckTasks', e.target.checked)} />
              Auto check tasks when pomodoros reach the estimate
            </label>
            <label className="check-row">
              <input type="checkbox" checked={settings.checkToBottom} onChange={(e) => updateSetting('checkToBottom', e.target.checked)} />
              Move finished tasks to the bottom
            </label>
            {!isDesktop && (
              <label className="field">
                Theme
                <select value={settings.theme} onChange={(e) => updateSetting('theme', e.target.value)}>
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </label>
            )}
            {isDesktop && (
              <label className="field">
                Analytics week starts on
                <select value={settings.weekStart} onChange={(e) => updateSetting('weekStart', e.target.value)}>
                  <option value="monday">Monday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </label>
            )}
            <label className="check-row">
              <input
                type="checkbox"
                checked={settings.tick}
                onChange={(e) => updateSetting('tick', e.target.checked)}
              />
              Tick during the last 10 seconds of focus
            </label>
            <div className="shortcuts">
              {SHORTCUTS.map(([key, label]) => (
                <div key={key}>
                  <kbd>{key}</kbd> {label}
                </div>
              ))}
            </div>
          </div>
          </section>
        </div>
      )}

      <div className="columns">
        <div className="col">
        <section className="card timer-card">
          <div className="modes">
            {MODES.map((m) => (
              <button
                key={m.phase}
                className={`mode ${phase === m.phase ? 'active' : ''}`}
                onClick={() => timer.goTo(m.phase)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="clock">{clock}</div>

          <div className="focus-picker">
            <span>Working on</span>
            <select value={selectedId || ''} onChange={(e) => setSelectedId(e.target.value || null)}>
              <option value="">No task</option>
              {tasks
                .filter((t) => !t.done || t.id === selectedId)
                .map((t) => (
                  <option key={t.id} value={t.id}>{t.text}</option>
                ))}
            </select>
          </div>

          <div className="round-controls">
            <button
              className="round-btn"
              onClick={() => runCommand('toggle')}
              aria-label={running ? 'Pause' : 'Start'}
              title={running ? 'Pause (Space)' : 'Start (Space)'}
            >
              {running ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="round-btn" onClick={() => runCommand('reset')} aria-label="Reset" title="Reset (R)">
              <ResetIcon />
            </button>
            <button className="round-btn" onClick={() => runCommand('skip')} aria-label="Skip" title="Skip (S)">
              <SkipIcon />
            </button>
            {isDesktop && (
            <button
              className={`round-btn ${miniOpen ? 'active' : ''}`}
              onClick={() => runCommand('mini')}
              aria-label="Mini timer"
              title="Mini timer (P)"
            >
              <PictureIcon />
            </button>
            )}
          </div>
        </section>
        <VideoPanel
          enabled
          shouldPlay={running}
          volume={settings.volume}
          onVolume={(v) => updateSetting('volume', v)}
          library={library}
          setLibrary={setLibrary}
          onUserPlayback={handleUserPlayback}
          defaultVideoId={settings.defaultVideo}
        />
        </div>
        <div className="col">
        <TaskPanel
          tasks={tasks}
          setTasks={setTasks}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          projects={projects}
          running={running}
          checkToBottom={settings.checkToBottom}
        />
        <ProjectPanel
          projects={projects}
          setProjects={setProjects}
          sessions={sessions}
          onDelete={deleteProject}
        />
          {isDesktop && <Analytics sessions={sessions} projects={projects} weekStart={settings.weekStart} />}
        </div>
      </div>

      {!isDesktop && <Footer />}
      {!isDesktop && <CookieNotice />}
    </div>
  );
}

function NumberField({ label, value, min, max, onChange }) {
  return (
    <label className="field">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
      />
    </label>
  );
}
