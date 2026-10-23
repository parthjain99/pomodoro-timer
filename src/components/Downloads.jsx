// Installers on the v0.1.0 GitHub release. The file names must match the files attached to that release.
const RELEASE = 'https://github.com/parthjain99/pomodoro-timer/releases/download/v0.1.0/';

const DOWNLOADS = [
  { os: 'mac', label: 'macOS', file: 'Pomodoro-0.1.0-arm64.dmg', note: 'Apple Silicon' },
  { os: 'windows', label: 'Windows', file: 'Pomodoro%20Setup%200.1.0.exe', note: '64-bit' },
  { os: 'linux', label: 'Linux', file: 'Pomodoro-0.1.0.AppImage', note: '64-bit AppImage' },
];

// Works out the visitor's system from the browser. Returns 'mac', 'windows', 'linux', or null.
function detectOs() {
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua)) return null;
  if (/Mac/i.test(ua)) return 'mac';
  if (/Win/i.test(ua)) return 'windows';
  if (/Linux/i.test(ua)) return 'linux';
  return null;
}

export default function Downloads() {
  const current = detectOs();
  const ordered = [...DOWNLOADS].sort((a, b) => (a.os === current ? -1 : b.os === current ? 1 : 0));

  return (
    <section className="card download-card">
      <div className="card-header static">
        <span className="card-title">Download the desktop app</span>
      </div>
      <div className="card-body download-links">
        {ordered.map((d) => (
          <a
            key={d.os}
            href={RELEASE + d.file}
            className={`download-btn ${d.os === current ? 'primary' : ''}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="download-label">Download for {d.label}</span>
            <span className="download-note">{d.note}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
