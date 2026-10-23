import { useCallback, useEffect, useRef, useState } from 'react';

const PLAYER_ERRORS = {
  2: 'That video ID looks invalid.',
  5: 'The video player hit an error.',
  100: 'That video was removed or is private.',
  101: 'The owner does not allow embedding this video.',
  150: 'The owner does not allow embedding this video.',
  153: 'YouTube rejected the embed (player configuration error).',
};

const ID_RE = /^[A-Za-z0-9_-]{11}$/;

// Turns "90", "1:30", "1:02:03", or "1h2m3s" into seconds. Anything else is 0.
export function parseTime(value) {
  if (value == null) return 0;
  const text = String(value).trim();
  if (!text) return 0;
  if (/^\d+$/.test(text)) return Number(text);
  const hms = text.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (hms && (hms[1] || hms[2] || hms[3])) {
    return Number(hms[1] || 0) * 3600 + Number(hms[2] || 0) * 60 + Number(hms[3] || 0);
  }
  const parts = text.split(':');
  if (parts.length >= 2 && parts.length <= 3 && parts.every((p) => /^\d+$/.test(p))) {
    return parts.reduce((acc, p) => acc * 60 + Number(p), 0);
  }
  return 0;
}

export function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`;
}

// Accepts a bare 11-character ID or a YouTube URL. A start time in the URL
// (?t=90, &t=1m30s, ?start=90) is read as the starting offset.
export function parseVideoRef(input) {
  const text = input.trim();
  if (ID_RE.test(text)) return { id: text, start: 0 };
  try {
    const url = new URL(text);
    let id = null;
    if (url.hostname === 'youtu.be') {
      id = url.pathname.slice(1, 12);
    } else if (url.hostname.endsWith('youtube.com')) {
      id = url.searchParams.get('v');
      if (!id) {
        const m = url.pathname.match(/^\/(embed|shorts|live)\/([A-Za-z0-9_-]{11})/);
        if (m) id = m[2];
      }
    }
    if (!id || !ID_RE.test(id)) return null;
    const start = parseTime(url.searchParams.get('t') || url.searchParams.get('start'));
    return { id, start };
  } catch {
    return null;
  }
}

let apiPromise = null;
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = resolve;
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => {
      apiPromise = null;
      reject(new Error('Could not load the YouTube player. Check your internet connection.'));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

// Owns one YouTube player.
//  - shouldPlay: true while a focus session runs. Used when `enabled` (sync) is on.
//  - onUserPlayback(playing): called when the video starts or pauses on its own
//    (the user pressed play/pause in the player). Programmatic changes also
//    fire this, so callers must treat it as idempotent.
export function useYouTube({ containerId, shouldPlay, enabled, volume, onUserPlayback }) {
  const playerRef = useRef(null);
  const readyRef = useRef(false);
  const pendingRef = useRef(null); // { id, start } waiting for the player to be ready
  // Player state changes are ignored until this time. Switching videos makes YouTube report
  // the old video as paused, which must not pause the timer.
  const ignoreUntilRef = useRef(0);
  const shouldPlayRef = useRef(shouldPlay);
  shouldPlayRef.current = shouldPlay;
  const onUserPlaybackRef = useRef(onUserPlayback);
  onUserPlaybackRef.current = onUserPlayback;

  const [ready, setReady] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [error, setError] = useState('');

  // Load a video. Autoplay only when a focus session is running, so opening a
  // video never starts the timer by accident.
  const openVideo = useCallback((player, id, start) => {
    const opts = { videoId: id, startSeconds: start };
    if (shouldPlayRef.current) player.loadVideoById(opts);
    else player.cueVideoById(opts);
  }, []);

  const load = useCallback(
    ({ id, start }) => {
      setError('');
      loadYouTubeApi()
        .then(() => {
          ignoreUntilRef.current = Date.now() + 2000;
          if (playerRef.current) {
            if (readyRef.current) openVideo(playerRef.current, id, start);
            else pendingRef.current = { id, start };
            return;
          }
          setHasVideo(true);
          playerRef.current = new window.YT.Player(containerId, {
            width: '100%',
            height: '100%',
            videoId: id,
            playerVars: { rel: 0, playsinline: 1, start: Math.floor(start) },
            events: {
              onReady: () => {
                readyRef.current = true;
                setReady(true);
                if (pendingRef.current) {
                  const p = pendingRef.current;
                  pendingRef.current = null;
                  openVideo(playerRef.current, p.id, p.start);
                }
              },
              onStateChange: (e) => {
                if (Date.now() < ignoreUntilRef.current) return;
                // 1 = playing, 2 = paused. Ignore buffering and ended.
                if (e.data === 1) onUserPlaybackRef.current?.(true);
                else if (e.data === 2) onUserPlaybackRef.current?.(false);
              },
              onError: (e) => setError(PLAYER_ERRORS[e.data] || `Player error (${e.data}).`),
            },
          });
        })
        .catch((err) => setError(err.message));
    },
    [containerId, openVideo]
  );

  useEffect(() => {
    if (ready && playerRef.current) playerRef.current.setVolume(volume);
  }, [ready, volume]);

  // Timer -> video: play during focus, pause otherwise.
  useEffect(() => {
    if (!enabled || !ready || !playerRef.current) return;
    try {
      if (shouldPlay) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    } catch {
      // player not ready for commands yet
    }
  }, [enabled, ready, shouldPlay]);

  return { load, error, hasVideo };
}
