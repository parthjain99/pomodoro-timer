import { useMemo, useState } from 'react';
import {
  RANGES,
  bucketsFor,
  countSessions,
  formatMinutes,
  minutesByProject,
  sessionsToCSV,
  sumMinutes,
} from '../lib/analytics.js';
import { ChartIcon } from './Icons.jsx';

export default function Analytics({ sessions, projects, weekStart = 'monday' }) {
  const [range, setRange] = useState('week');
  const now = useMemo(() => new Date(), [range, sessions.length]);
  const buckets = useMemo(() => bucketsFor(range, now, weekStart), [range, now, weekStart]);
  const start = buckets[0].start;
  const end = buckets[buckets.length - 1].end;

  const totalMin = sumMinutes(sessions, start, end);
  const count = countSessions(sessions, start, end);

  const series = buckets.map((b) => ({ ...b, minutes: sumMinutes(sessions, b.start, b.end) }));
  const peak = Math.max(1, ...series.map((b) => b.minutes));

  const byProject = [...minutesByProject(sessions, start, end)].sort((a, b) => b[1] - a[1]);
  const projectName = (id) => {
    if (id === null) return 'No project';
    return projects.find((p) => p.id === id)?.name || 'Deleted project';
  };
  const projectColor = (id) => projects.find((p) => p.id === id)?.color || '#9a9aa2';

  function exportCsv() {
    const csv = sessionsToCSV(sessions, projects);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomodoro-sessions-${new Date().toLocaleDateString('en-CA')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="card">
      <div className="card-header static">
        <span className="card-title">
          <ChartIcon /> Analytics
        </span>
        <button className="small-btn" onClick={exportCsv} disabled={sessions.length === 0}>
          Export CSV
        </button>
      </div>

      <div className="card-body">
        <div className="seg" role="group" aria-label="Range">
          {RANGES.map((r) => (
            <button key={r.key} className={range === r.key ? 'active' : ''} onClick={() => setRange(r.key)}>
              {r.label}
            </button>
          ))}
        </div>

        <div className="stat-row">
          <div className="stat">
            <div className="stat-value">{formatMinutes(totalMin)}</div>
            <div className="stat-label">Focus time</div>
          </div>
          <div className="stat">
            <div className="stat-value">{count}</div>
            <div className="stat-label">Sessions</div>
          </div>
        </div>

        {range !== 'day' && (
          <div className="bars" aria-label="Focus minutes per period">
            {series.map((b) => (
              <div className="bar-col" key={b.label + b.start} title={`${b.label}: ${formatMinutes(b.minutes)}`}>
                <div className="bar" style={{ height: `${(b.minutes / peak) * 100}%` }} />
                <div className="bar-label">{b.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="breakdown">
          <div className="breakdown-title">By project</div>
          {byProject.length === 0 && <div className="hint">No focus sessions in this period yet.</div>}
          {byProject.map(([id, minutes]) => (
            <div className="breakdown-row" key={String(id)}>
              <span className="dot" style={{ background: projectColor(id) }} />
              <span className="breakdown-name">{projectName(id)}</span>
              <span className="breakdown-track">
                <span
                  className="breakdown-fill"
                  style={{ width: `${(minutes / Math.max(1, totalMin)) * 100}%`, background: projectColor(id) }}
                />
              </span>
              <span className="count">{formatMinutes(minutes)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
