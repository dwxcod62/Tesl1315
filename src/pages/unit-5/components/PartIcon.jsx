// Tiny pixel-art icons for the part cards. Inline SVG, no assets.
export default function PartIcon({ kind = 'compass', size = 38 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    shapeRendering: 'crispEdges',
    'aria-hidden': true,
  };
  switch (kind) {
    case 'compass':
      return (
        <svg {...common}>
          <rect x="6" y="1" width="4" height="14" fill="#c9a35a" />
          <rect x="1" y="6" width="14" height="4" fill="#c9a35a" />
          <rect x="7" y="2" width="2" height="12" fill="#1a1006" />
          <rect x="2" y="7" width="12" height="2" fill="#1a1006" />
          <rect x="7" y="7" width="2" height="2" fill="#f4e0a8" />
        </svg>
      );
    case 'soldier':
      return (
        <svg {...common}>
          <rect x="6" y="0" width="4" height="2" fill="#1a0e04" />
          <rect x="5" y="2" width="6" height="4" fill="#d8a878" />
          <rect x="4" y="6" width="8" height="6" fill="#8a5a30" />
          <rect x="3" y="6" width="1" height="5" fill="#8a5a30" />
          <rect x="12" y="6" width="1" height="5" fill="#8a5a30" />
          <rect x="5" y="12" width="2" height="3" fill="#1a0e04" />
          <rect x="9" y="12" width="2" height="3" fill="#1a0e04" />
          <rect x="14" y="3" width="1" height="8" fill="#2a1a08" />
          <rect x="13" y="2" width="3" height="1" fill="#4a3a1c" />
        </svg>
      );
    case 'brush':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="2" height="10" fill="#c9a35a" />
          <rect x="4" y="2" width="2" height="10" fill="#c9a35a" />
          <rect x="6" y="4" width="2" height="8" fill="#8a6a3a" />
          <rect x="8" y="5" width="2" height="7" fill="#5a3a1c" />
          <rect x="10" y="6" width="2" height="6" fill="#3a2a14" />
          <rect x="12" y="7" width="2" height="5" fill="#1a1006" />
        </svg>
      );
    case 'hammer':
      return (
        <svg {...common}>
          <rect x="4" y="2" width="8" height="4" fill="#8a7a5a" />
          <rect x="3" y="3" width="1" height="2" fill="#6e5727" />
          <rect x="12" y="3" width="1" height="2" fill="#6e5727" />
          <rect x="7" y="6" width="2" height="8" fill="#5a4624" />
          <rect x="7" y="6" width="2" height="2" fill="#3a2a14" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4" y="7" width="8" height="7" fill="#c9a35a" />
          <rect x="5" y="8" width="6" height="4" fill="#1a1006" />
          <rect x="5" y="3" width="6" height="4" fill="none" stroke="#c9a35a" strokeWidth="1.4" />
          <rect x="7" y="9" width="2" height="3" fill="#c9a35a" />
        </svg>
      );
    default:
      return null;
  }
}