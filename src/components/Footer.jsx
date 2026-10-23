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
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
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
      <p className="legal-line"><a href="privacy.html">Privacy policy</a></p>
    </footer>
  );
}
