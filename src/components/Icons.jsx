// Minimal inline icons (stroke-based, 24px grid).
const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const PlayIcon = (p) => (
  <svg {...base} {...p}><path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" /></svg>
);
export const PauseIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
  </svg>
);
export const ResetIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);
export const SkipIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 5.5v13l8-6.5z" fill="currentColor" />
    <path d="M12 5.5v13l8-6.5z" fill="currentColor" />
    <path d="M20 5v14" />
  </svg>
);
export const GearIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);
export const MusicIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);
export const ChevronIcon = ({ open, ...p }) => (
  <svg {...base} width={18} height={18} {...p} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
export const FullscreenIcon = (p) => (
  <svg {...base} width={18} height={18} {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);
export const ExitFullscreenIcon = (p) => (
  <svg {...base} width={18} height={18} {...p}>
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </svg>
);
export const CheckIcon = (p) => (
  <svg {...base} width={16} height={16} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const PlusIcon = (p) => (
  <svg {...base} width={18} height={18} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const ChartIcon = (p) => (
  <svg {...base} width={18} height={18} {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
);
export const FolderIcon = (p) => (
  <svg {...base} width={18} height={18} {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
);
export const StarIcon = ({ filled, ...p }) => (
  <svg {...base} width={18} height={18} {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z" />
  </svg>
);
export const PictureIcon = (p) => (
  <svg {...base} width={18} height={18} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <rect x="12" y="11" width="7" height="6" rx="1" fill="currentColor" stroke="none" />
  </svg>
);
