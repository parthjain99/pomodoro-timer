import { useState } from 'react';

const CONSENT_COOKIE = 'pomodoro-consent';

function hasConsent() {
  return document.cookie.split('; ').some((c) => c.startsWith(`${CONSENT_COOKIE}=`));
}

// Shown on the web version until the visitor accepts. Pomodoro stores its data in cookies, so this tells them so.
export default function CookieNotice() {
  const [open, setOpen] = useState(() => !hasConsent());
  if (!open) return null;

  function accept() {
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `${CONSENT_COOKIE}=yes; expires=${expires}; path=/; SameSite=Lax`;
    setOpen(false);
  }

  return (
    <div className="cookie-notice" role="dialog" aria-label="Cookie notice">
      <p>
        Pomodoro saves your tasks, projects, and settings in cookies on this device. Nothing is sent to a server.
        Videos play from YouTube, which sets its own cookies. <a href="privacy.html">Privacy policy</a>
      </p>
      <button className="primary" onClick={accept}>OK</button>
    </div>
  );
}
