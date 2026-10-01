const PATHS = {
  about: (
    <>
      <circle cx="12" cy="8.2" r="3.4" />
      <path d="M4.9 19.4a7.4 7.4 0 0 1 14.2 0" />
    </>
  ),
  resume: (
    <>
      <path d="M12 3.8 2.9 8.3 12 12.8l9.1-4.5L12 3.8Z" />
      <path d="M6.7 10.4v4.9c0 1.5 2.4 2.7 5.3 2.7s5.3-1.2 5.3-2.7v-4.9" />
      <path d="M21.1 8.3v5.1" />
    </>
  ),
  skills: (
    <>
      <path d="M4 7h8" />
      <path d="M18.5 7H20" />
      <circle cx="15" cy="7" r="2.1" />
      <path d="M4 12h3.5" />
      <path d="M14 12h6" />
      <circle cx="10.5" cy="12" r="2.1" />
      <path d="M4 17h8" />
      <path d="M18.5 17H20" />
      <circle cx="15" cy="17" r="2.1" />
    </>
  ),
  projects: (
    <>
      <rect x="3" y="7.4" width="18" height="12.2" rx="2.4" />
      <path d="M9 7.4V6.2A2.2 2.2 0 0 1 11.2 4h1.6A2.2 2.2 0 0 1 15 6.2v1.2" />
      <path d="M3 12.4h18" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="5.4" width="18" height="13.2" rx="2.4" />
      <path d="m4.2 7.6 6.9 4.7a1.6 1.6 0 0 0 1.8 0l6.9-4.7" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4.4" width="18" height="15.2" rx="2.4" />
      <path d="m7.4 10 2.7 2.6-2.7 2.6" />
      <path d="M13.4 15.6h4.2" />
    </>
  ),
  tictactoe: (
    <>
      <path d="M4.4 4.4h6.2v6.2H4.4z" />
      <path d="M13.4 13.4h6.2v6.2h-6.2z" />
      <path d="m14.2 4.8 4.8 4.8M19 4.8l-4.8 4.8" />
    </>
  ),
  music: (
    <>
      <circle cx="7.4" cy="17.6" r="2.9" />
      <circle cx="17.6" cy="15" r="2.9" />
      <path d="M10.3 17.6V6.2l10.2-2.4v11.2" />
    </>
  ),
  paint: (
    <>
      <path d="M12 3.4a8.6 8.6 0 1 0 0 17.2c1.3 0 1.9-.9 1.9-1.9 0-1.7-1.3-1.9-1.3-3.1 0-.9.7-1.5 1.6-1.5h1.5A4.9 4.9 0 0 0 20.6 9c0-3.6-3.8-5.6-8.6-5.6Z" />
      <circle cx="8.2" cy="10.4" r="1.1" />
      <circle cx="12" cy="7.6" r="1.1" />
      <circle cx="15.9" cy="9.8" r="1.1" />
    </>
  ),
};

export default function AppIcon({ name, size = 18, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}
