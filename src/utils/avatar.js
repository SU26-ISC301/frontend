export const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="bg" x1="20" y1="10" x2="140" y2="150" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ff4d4f"/>
          <stop offset="0.55" stop-color="#ff3d7f"/>
          <stop offset="1" stop-color="#ff7a45"/>
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#bg)"/>
      <circle cx="80" cy="62" r="30" fill="white" opacity="0.95"/>
      <path d="M31 138c7-29 25-45 49-45s42 16 49 45" fill="white" opacity="0.95"/>
    </svg>
  `);

export const getAvatarSrc = (avatarUrl) => avatarUrl || DEFAULT_AVATAR;
