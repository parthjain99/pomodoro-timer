// App data is kept in browser cookies. A single cookie holds about 4KB, so the JSON is
// split across several numbered cookies: pomodoro-0, pomodoro-1, ... with pomodoro-n = count.
const PREFIX = 'pomodoro';
const COOKIE_BUDGET = 3500; // bytes per cookie, after URL-encoding, kept under the 4KB limit
const MAX_COOKIES = 40; // about 140KB total, well under browser limits
const LIFETIME_DAYS = 365;

function readAll() {
  const out = {};
  if (!document.cookie) return out;
  for (const part of document.cookie.split('; ')) {
    const i = part.indexOf('=');
    if (i > 0) out[decodeURIComponent(part.slice(0, i))] = decodeURIComponent(part.slice(i + 1));
  }
  return out;
}

function writeCookie(name, value) {
  const expires = new Date(Date.now() + LIFETIME_DAYS * 864e5).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// Split a string into pieces whose URL-encoded form fits the cookie budget.
function splitForCookies(text) {
  const pieces = [];
  let current = '';
  let size = 0;
  for (const ch of text) {
    const enc = encodeURIComponent(ch).length;
    if (size + enc > COOKIE_BUDGET) {
      pieces.push(current);
      current = '';
      size = 0;
    }
    current += ch;
    size += enc;
  }
  if (current) pieces.push(current);
  return pieces;
}

// The desktop app runs from a custom app:// address where cookies do not persist, so it keeps
// using local storage. The web version uses cookies.
const isDesktop = () => typeof window !== 'undefined' && Boolean(window.pomodoro);
const DESKTOP_KEY = 'pomodoro-desktop-v1';

export function loadState() {
  if (isDesktop()) {
    try {
      return JSON.parse(localStorage.getItem(DESKTOP_KEY)) || {};
    } catch {
      return {};
    }
  }
  try {
    const all = readAll();
    const count = Number(all[`${PREFIX}-n`] || 0);
    if (!count) return {};
    let json = '';
    for (let i = 0; i < count; i++) json += all[`${PREFIX}-${i}`] ?? '';
    return JSON.parse(json) || {};
  } catch {
    return {};
  }
}

export function saveState(state) {
  if (isDesktop()) {
    try {
      localStorage.setItem(DESKTOP_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
    return;
  }
  try {
    let pieces = splitForCookies(JSON.stringify(state));
    // Too big: drop the oldest focus sessions until it fits.
    let trimmed = state;
    while (pieces.length > MAX_COOKIES && trimmed.sessions?.length) {
      trimmed = { ...trimmed, sessions: trimmed.sessions.slice(Math.ceil(trimmed.sessions.length / 2)) };
      pieces = splitForCookies(JSON.stringify(trimmed));
    }
    if (pieces.length > MAX_COOKIES) return; // still too big; keep the last good copy
    const previous = Number(readAll()[`${PREFIX}-n`] || 0);
    pieces.forEach((piece, i) => writeCookie(`${PREFIX}-${i}`, piece));
    writeCookie(`${PREFIX}-n`, String(pieces.length));
    for (let i = pieces.length; i < previous; i++) deleteCookie(`${PREFIX}-${i}`);
  } catch {
    // Cookies can be blocked; the app keeps working without saving.
  }
}
