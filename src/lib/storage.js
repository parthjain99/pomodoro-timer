const KEY = 'pomodoro-desktop-v1';

// Local storage can be unavailable or full; the app keeps working without it.
export function loadState() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}
