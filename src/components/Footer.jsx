import logo from '../assets/logo.png';

import Downloads from './Downloads.jsx';

// Links for the Connect with me section. A link with an empty url is hidden.
const CONNECT_LINKS = [
  { label: 'GitHub', url: 'https://github.com/parthjain99' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/parthhjain/' },
  { label: 'Email', url: 'mailto:parthjain99@proton.me' },
];

const ICONS = {
  GitHub: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">GH</text>
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">in</text>
    </svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 7l10 6 10-6" />
    </svg>
  ),
};

const FEATURES = [
  ['Timer', 'focus and break cycles with adjustable lengths, a clock that counts down, and a mini always-on-top window.'],
  ['Task list', 'add tasks with an estimated number of pomodoros, mark them done, and pick the one you are working on.'],
  ['Projects', 'group tasks into projects and see the time tracked for each.'],
  ['YouTube music', 'paste a link and play focus music. Pressing play starts the timer, and pausing pauses it.'],
  ['Saved and recent videos', 'star videos to keep them, and reopen recently played ones.'],
  ['Settings', 'change durations, turn the alarm on or off, and choose which panels show on screen.'],
  ['Keyboard shortcuts', 'start, pause, reset, skip, and open the mini timer without the mouse.'],
  ['No sign-up', 'nothing to create. Your data stays on your device.'],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <Downloads />
      <section className="card features-card">
        <div className="card-header static">
          <span className="card-title">Features</span>
        </div>
        <div className="card-body">
          <p className="features-tagline">A free Pomodoro timer with YouTube music and task management in one place.</p>
          <ul className="features-list">
            {FEATURES.map(([title, text]) => (
              <li key={title}>
                <strong>{title}:</strong> {text}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="card connect-card">
        <div className="card-header static">
          <span className="card-title">Connect with me</span>
        </div>
        <div className="card-body connect-links">
          {CONNECT_LINKS.filter((l) => l.url).map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer">
              <span className="connect-icon">{ICONS[l.label]}</span>
              {l.label}
            </a>
          ))}
        </div>
      </section>
    </footer>
  );
}
