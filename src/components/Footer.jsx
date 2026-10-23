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
    </footer>
  );
}
