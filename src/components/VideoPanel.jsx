import { useEffect, useState } from 'react';
import { parseVideoRef, useYouTube } from '../lib/youtube.js';
import { ChevronIcon, ExitFullscreenIcon, FullscreenIcon, MusicIcon, StarIcon } from './Icons.jsx';

const PLAYER_ID = 'yt-player';
const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
const PLAYER_WIDTH = '320px';
const RECENT_LIMIT = 10;

async function fetchTitle(id) {
  try {
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
    const res = await fetch(url);
    if (!res.ok) return '';
    const data = await res.json();
    return data.title || '';
  } catch {
    return '';
  }
}

export default function VideoPanel({
  enabled,
  onToggleSync,
  shouldPlay,
  volume,
  onVolume,
  library,
  setLibrary,
  onUserPlayback,
  defaultVideoId,
}) {
  const [open, setOpen] = useState(true);

  // Fill in titles for library entries that have none yet (e.g. the baseline video).
  useEffect(() => {
    library
      .filter((i) => !i.title)
      .forEach((i) => {
        fetchTitle(i.id).then((title) => {
          if (title) setLibrary((prev) => prev.map((x) => (x.id === i.id && !x.title ? { ...x, title } : x)));
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [url, setUrl] = useState(() => (defaultVideoId ? watchUrl(defaultVideoId) : ''));
  const [formError, setFormError] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [frameEl, setFrameEl] = useState(null);

  const { load, error, hasVideo } = useYouTube({
    containerId: PLAYER_ID,
    shouldPlay,
    enabled,
    volume,
    onUserPlayback,
  });

  // Load the default video at startup and whenever it changes. It stays paused unless the timer is running.
  useEffect(() => {
    if (defaultVideoId) load({ id: defaultVideoId, start: 0 });
  }, [defaultVideoId]);

  // Show the default video's link in the box, including on every app start.
  useEffect(() => {
    if (defaultVideoId) setUrl(watchUrl(defaultVideoId));
  }, [defaultVideoId]);

  // Keep the fullscreen icon in sync with the browser's state.
  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  function recordPlay(id) {
    const now = Date.now();
    setLibrary((prev) => {
      const exists = prev.find((i) => i.id === id);
      const next = exists
        ? prev.map((i) => (i.id === id ? { ...i, lastPlayed: now } : i))
        : [{ id, title: '', saved: false, lastPlayed: now }, ...prev];
      return trimLibrary(next);
    });
    fetchTitle(id).then((title) => {
      if (!title) return;
      setLibrary((prev) => prev.map((i) => (i.id === id ? { ...i, title } : i)));
    });
  }

  function playVideo(id, start) {
    setFormError('');
    load({ id, start });
    recordPlay(id);
  }

  function submit(e) {
    e.preventDefault();
    const ref = parseVideoRef(url);
    if (!ref) {
      setFormError('Paste a YouTube link or an 11-character video ID.');
      return;
    }
    playVideo(ref.id, ref.start);
  }

  function toggleFullscreen() {
    if (!frameEl) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else frameEl.requestFullscreen?.();
  }

  function toggleSaved(id) {
    setLibrary((prev) => prev.map((i) => (i.id === id ? { ...i, saved: !i.saved } : i)));
  }

  function removeItem(id) {
    setLibrary((prev) => prev.filter((i) => i.id !== id));
  }

  const savedItems = sortByRecent(library.filter((i) => i.saved));
  const recentItems = sortByRecent(library).slice(0, RECENT_LIMIT);
  const message = formError || error;

  return (
    <section className="card">
      <button className="card-header" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="card-title">
          <MusicIcon /> Focus Music
        </span>
        <span className="card-hint">
          You can use audio from YouTube. <ChevronIcon open={open} />
        </span>
      </button>

      {(
        <div className="card-body" hidden={!open}>
          <form className="row-form" onSubmit={submit}>
            <input
              type="text"
              placeholder="Paste a link or pick a recent video"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button type="submit">Load</button>
          </form>

          <div className="video-controls">
            <label className="volume">
              Volume
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => onVolume(Number(e.target.value))}
              />
              <span>{volume}%</span>
            </label>
          </div>

          <div className="player-row">
            <div
              ref={setFrameEl}
              className={`player-frame ${fullscreen ? 'is-fullscreen' : ''}`}
              style={{ maxWidth: PLAYER_WIDTH }}
            >
              <div id={PLAYER_ID} />
              {!hasVideo && <div className="player-empty">No video loaded</div>}
              {hasVideo && (
                <button
                  className="fs-btn"
                  onClick={toggleFullscreen}
                  title={fullscreen ? 'Exit full screen' : 'Full screen'}
                >
                  {fullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                </button>
              )}
            </div>
          </div>

          {message && <p className="error">{message}</p>}

          <LibraryList
            title="Saved"
            items={savedItems}
            empty="Star a video to keep it here."
            onPlay={(id) => playVideo(id, 0)}
            onToggleSaved={toggleSaved}
            onRemove={removeItem}
          />
          <LibraryList
            title="Recently played"
            dropdown
            items={recentItems}
            empty="Videos you play will show up here."
            onPlay={(id) => playVideo(id, 0)}
            onToggleSaved={toggleSaved}
            onRemove={removeItem}
          />
        </div>
      )}
    </section>
  );
}

function LibraryList({ title, items, empty, onPlay, onToggleSaved, onRemove, dropdown }) {
  const body = (
    <>
      {items.length === 0 && <div className="hint">{empty}</div>}
      <ul className="task-list library-list">
        {items.map((item) => (
          <li key={item.id}>
            <button className="link-btn label" onClick={() => onPlay(item.id)} title="Play">
              {item.title || `Video ${item.id}`}
            </button>
            <button
              className={`small ghost star ${item.saved ? 'on' : ''}`}
              onClick={() => onToggleSaved(item.id)}
              title={item.saved ? 'Unsave' : 'Save'}
              aria-label={item.saved ? 'Unsave' : 'Save'}
            >
              <StarIcon filled={item.saved} />
            </button>
            <button className="small ghost" onClick={() => onRemove(item.id)} title="Remove from list">
              ×
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  if (dropdown) {
    return (
      <details className="dropdown">
        <summary>
          {title} <span className="count">({items.length})</span>
        </summary>
        {body}
      </details>
    );
  }
  return (
    <div className="library">
      <div className="breakdown-title">{title}</div>
      {body}
    </div>
  );
}

const MAX_LIBRARY = 50;

// Keeps every saved video, and at most MAX_LIBRARY unsaved ones (newest first).
function trimLibrary(items) {
  const saved = items.filter((i) => i.saved);
  const unsaved = sortByRecent(items.filter((i) => !i.saved)).slice(0, MAX_LIBRARY);
  return [...saved, ...unsaved];
}

function sortByRecent(items) {
  return [...items].sort((a, b) => b.lastPlayed - a.lastPlayed);
}
