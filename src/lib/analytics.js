// Time-range helpers for focus-session analytics. All ranges use local time.

export const RANGES = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Buckets for a range: each has a label and [start, end) timestamps.
export function bucketsFor(range, now = new Date()) {
  if (range === 'day') {
    const s = startOfDay(now);
    const e = new Date(s);
    e.setDate(e.getDate() + 1);
    return [{ label: 'Today', start: s.getTime(), end: e.getTime() }];
  }
  if (range === 'week') {
    const today = startOfDay(now);
    return Array.from({ length: 7 }, (_, i) => {
      const s = new Date(today);
      s.setDate(today.getDate() - (6 - i));
      const e = new Date(s);
      e.setDate(s.getDate() + 1);
      return { label: s.toLocaleDateString(undefined, { weekday: 'short' }), start: s.getTime(), end: e.getTime() };
    });
  }
  if (range === 'month') {
    const y = now.getFullYear();
    const m = now.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => ({
      label: String(i + 1),
      start: new Date(y, m, i + 1).getTime(),
      end: new Date(y, m, i + 2).getTime(),
    }));
  }
  // year
  const y = now.getFullYear();
  return Array.from({ length: 12 }, (_, m) => ({
    label: new Date(y, m, 1).toLocaleDateString(undefined, { month: 'short' }),
    start: new Date(y, m, 1).getTime(),
    end: new Date(y, m + 1, 1).getTime(),
  }));
}

export function sumMinutes(sessions, start, end) {
  let total = 0;
  for (const s of sessions) {
    if (s.at >= start && s.at < end) total += s.minutes;
  }
  return total;
}

export function countSessions(sessions, start, end) {
  return sessions.filter((s) => s.at >= start && s.at < end).length;
}

// Minutes per project id (null = no project) within [start, end).
export function minutesByProject(sessions, start, end) {
  const map = new Map();
  for (const s of sessions) {
    if (s.at < start || s.at >= end) continue;
    const key = s.projectId ?? null;
    map.set(key, (map.get(key) || 0) + s.minutes);
  }
  return map;
}

export function formatMinutes(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function sessionsToCSV(sessions, projects) {
  const names = new Map(projects.map((p) => [p.id, p.name]));
  const header = ['date', 'time', 'minutes', 'project', 'task'];
  const rows = [...sessions]
    .sort((a, b) => a.at - b.at)
    .map((s) => {
      const d = new Date(s.at);
      return [
        d.toLocaleDateString('en-CA'),
        d.toLocaleTimeString('en-GB'),
        s.minutes,
        s.projectId ? names.get(s.projectId) || '' : '',
        s.taskText || '',
      ].map(csvCell).join(',');
    });
  return [header.join(','), ...rows].join('\n');
}
