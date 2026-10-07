// Big scene illustrations shown behind the folder caption.
// Self-contained pixel SVGs, no external assets.

const PALETTE = {
  bg: '#0a0805',
  ground: '#2a1808',
  ground2: '#5a3a1c',
  terracotta: '#8a5a30',
  terracotta2: '#7a4828',
  skin: '#d8a878',
  hair: '#1a0e04',
  gold: '#c9a35a',
  goldLight: '#f4e0a8',
  shadow: '#3a2a14',
  mercury: '#c9d6e0',
  door: '#0a0603',
};

export default function Scene({ kind = 'location' }) {
  switch (kind) {
    case 'location':
      return <LocationScene />;
    case 'army':
      return <ArmyScene />;
    case 'artistry':
      return <ArtistryScene />;
    case 'craft':
      return <CraftScene />;
    case 'mystery':
      return <MysteryScene />;
    default:
      return null;
  }
}

function Frame({ children }) {
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {children}
    </svg>
  );
}

function LocationScene() {
  return (
    <Frame>
      {/* sky */}
      <defs>
        <linearGradient id="loc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a1f12" />
          <stop offset="100%" stopColor="#d68a3a" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#loc-sky)" />
      <circle cx="240" cy="56" r="20" fill={PALETTE.goldLight} />

      {/* Mountains */}
      <g fill={PALETTE.shadow}>
        <polygon points="0,120 40,90 80,120" />
        <polygon points="60,120 100,80 140,120" />
        <polygon points="120,120 170,72 220,120" />
        <polygon points="200,120 240,90 280,120" />
        <polygon points="260,120 300,100 320,120 320,160 260,160" />
      </g>

      {/* Ground */}
      <rect x="0" y="160" width="320" height="40" fill={PALETTE.ground} />
      <rect x="0" y="160" width="320" height="2" fill={PALETTE.ground2} />

      {/* Map grid */}
      <g stroke={PALETTE.gold} strokeWidth="0.4" opacity="0.3">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1={i * 32} y1="160" x2={i * 32} y2="200" />
        ))}
      </g>

      {/* City marker */}
      <g transform="translate(140 110)">
        <rect x="0" y="0" width="14" height="14" fill={PALETTE.gold} />
        <rect x="2" y="2" width="10" height="10" fill={PALETTE.bg} />
        <rect x="5" y="-6" width="4" height="6" fill={PALETTE.gold} />
        <rect x="9" y="-3" width="2" height="3" fill={PALETTE.goldLight} />
        <text
          x="20"
          y="11"
          fill={PALETTE.goldLight}
          fontSize="8"
          fontFamily="monospace"
          style={{ letterSpacing: '1.5px' }}
        >
          XI’AN
        </text>
      </g>

      {/* Crosshair */}
      <g stroke={PALETTE.goldLight} strokeWidth="1" fill="none">
        <line x1="145" y1="100" x2="155" y2="100" />
        <line x1="150" y1="95" x2="150" y2="105" />
      </g>
    </Frame>
  );
}

function ArmyScene() {
  const soldiers = Array.from({ length: 9 });
  return (
    <Frame>
      <rect width="320" height="200" fill={PALETTE.bg} />
      {/* Pit floor */}
      <rect x="0" y="140" width="320" height="60" fill={PALETTE.ground} />
      <rect x="0" y="140" width="320" height="2" fill={PALETTE.ground2} />

      {/* Pit walls */}
      <rect x="0" y="40" width="6" height="100" fill={PALETTE.shadow} />
      <rect x="314" y="40" width="6" height="100" fill={PALETTE.shadow} />

      {/* Roof beams */}
      <g fill={PALETTE.shadow}>
        <rect x="6" y="50" width="308" height="6" />
        <rect x="6" y="50" width="308" height="1" fill={PALETTE.ground2} />
      </g>

      {/* Soldiers row */}
      {soldiers.map((_, i) => (
        <g key={i} transform={`translate(${30 + i * 32} 100)`}>
          {/* spear */}
          <rect x="9" y="-44" width="1" height="46" fill={PALETTE.bg} />
          <rect x="7" y="-46" width="5" height="3" fill={PALETTE.ground2} />
          {/* head */}
          <rect x="5" y="-40" width="8" height="6" fill={PALETTE.skin} />
          {/* topknot */}
          <rect x="6" y="-44" width="6" height="4" fill={PALETTE.hair} />
          {/* body */}
          <rect x="3" y="-32" width="12" height="14" fill={PALETTE.terracotta} />
          {/* belt */}
          <rect x="3" y="-25" width="12" height="1" fill={PALETTE.hair} />
          {/* arms */}
          <rect x="1" y="-32" width="2" height="10" fill={PALETTE.terracotta} />
          <rect x="15" y="-32" width="2" height="10" fill={PALETTE.terracotta} />
          {/* legs */}
          <rect x="4" y="-18" width="4" height="14" fill={PALETTE.hair} />
          <rect x="10" y="-18" width="4" height="14" fill={PALETTE.hair} />
          {/* feet */}
          <rect x="3" y="-4" width="5" height="2" fill={PALETTE.terracotta} />
          <rect x="10" y="-4" width="5" height="2" fill={PALETTE.terracotta} />
        </g>
      ))}

      {/* dust at base */}
      <g opacity="0.5">
        <rect x="20" y="142" width="280" height="3" fill={PALETTE.shadow} />
      </g>

      {/* Spotlight */}
      <rect x="60" y="60" width="200" height="80" fill={PALETTE.terracotta} opacity="0.06" />
    </Frame>
  );
}

function ArtistryScene() {
  const faces = [
    { x: 40, hair: '#1a0e04', skin: '#d8a878', eye: '#1a1006' },
    { x: 130, hair: '#3a2a14', skin: '#c89870', eye: '#1a1006' },
    { x: 220, hair: '#5a3a1c', skin: '#e8c098', eye: '#1a1006' },
  ];
  return (
    <Frame>
      <rect width="320" height="200" fill={PALETTE.bg} />
      {/* pedestal */}
      <rect x="0" y="160" width="320" height="40" fill={PALETTE.ground} />
      <rect x="0" y="160" width="320" height="2" fill={PALETTE.ground2} />

      {/* three faces */}
      {faces.map((f, i) => (
        <g key={i} transform={`translate(${f.x} 30)`}>
          {/* hair/top */}
          <rect x="0" y="0" width="60" height="14" fill={f.hair} />
          <rect x="2" y="2" width="56" height="3" fill={PALETTE.shadow} />
          {/* face */}
          <rect x="0" y="14" width="60" height="76" fill={f.skin} />
          {/* cheeks shadow */}
          <rect x="0" y="14" width="60" height="2" fill={PALETTE.shadow} opacity="0.4" />
          {/* eyes */}
          <rect x="14" y="34" width="6" height="3" fill={f.eye} />
          <rect x="40" y="34" width="6" height="3" fill={f.eye} />
          {/* brows */}
          <rect x="13" y="30" width="8" height="1" fill={f.hair} />
          <rect x="39" y="30" width="8" height="1" fill={f.hair} />
          {/* nose */}
          <rect x="29" y="44" width="2" height="10" fill={PALETTE.shadow} opacity="0.4" />
          {/* mouth */}
          <rect x="22" y="64" width="16" height="2" fill={PALETTE.shadow} />
          {/* chin */}
          <rect x="0" y="90" width="60" height="2" fill={PALETTE.shadow} opacity="0.3" />
          {/* shoulder/clothes */}
          <rect x="-2" y="92" width="64" height="38" fill={PALETTE.terracotta} />
          <rect x="-2" y="92" width="64" height="2" fill={PALETTE.shadow} />
          {/* collar */}
          <rect x="22" y="94" width="16" height="6" fill={f.skin} />
        </g>
      ))}

      {/* labels */}
      <g fill={PALETTE.gold} fontSize="6" fontFamily="monospace" style={{ letterSpacing: '1px' }}>
        <text x="40" y="125" textAnchor="middle">RANK A</text>
        <text x="130" y="125" textAnchor="middle">RANK B</text>
        <text x="220" y="125" textAnchor="middle">RANK C</text>
      </g>
    </Frame>
  );
}

function CraftScene() {
  return (
    <Frame>
      <rect width="320" height="200" fill={PALETTE.bg} />

      {/* Workbench */}
      <rect x="0" y="150" width="320" height="50" fill={PALETTE.ground} />
      <rect x="0" y="150" width="320" height="3" fill={PALETTE.ground2} />

      {/* Tools array */}
      {/* Hammer */}
      <g transform="translate(40 130)">
        <rect x="0" y="0" width="24" height="6" fill={PALETTE.ground2} />
        <rect x="10" y="6" width="4" height="14" fill={PALETTE.shadow} />
        <rect x="8" y="20" width="8" height="4" fill={PALETTE.shadow} />
      </g>

      {/* Bowl of clay */}
      <g transform="translate(110 140)">
        <ellipse cx="20" cy="0" rx="22" ry="4" fill={PALETTE.terracotta} />
        <ellipse cx="20" cy="-2" rx="18" ry="3" fill={PALETTE.terracotta2} />
        <rect x="6" y="-6" width="28" height="3" fill={PALETTE.terracotta} />
      </g>

      {/* Half-built figure */}
      <g transform="translate(200 70)">
        <rect x="0" y="0" width="20" height="4" fill={PALETTE.hair} />
        <rect x="0" y="4" width="20" height="14" fill={PALETTE.skin} />
        <rect x="0" y="18" width="20" height="22" fill={PALETTE.terracotta} />
        <rect x="-2" y="18" width="2" height="14" fill={PALETTE.terracotta} />
        <rect x="20" y="18" width="2" height="14" fill={PALETTE.terracotta} />
        <rect x="2" y="40" width="6" height="22" fill={PALETTE.hair} />
        <rect x="12" y="40" width="6" height="22" fill={PALETTE.hair} />
      </g>

      {/* Sparks */}
      <g fill={PALETTE.goldLight}>
        <rect x="70" y="110" width="2" height="2" />
        <rect x="74" y="114" width="2" height="2" />
        <rect x="78" y="108" width="2" height="2" />
        <rect x="82" y="112" width="2" height="2" />
      </g>

      {/* Connecting lines - assembly */}
      <g stroke={PALETTE.gold} strokeWidth="0.5" fill="none" opacity="0.4">
        <path d="M 80 150 Q 130 130 180 130" strokeDasharray="2 2" />
      </g>

      {/* Sparks overhead */}
      <g fill={PALETTE.gold} opacity="0.6">
        <rect x="150" y="40" width="1" height="1" />
        <rect x="155" y="45" width="1" height="1" />
        <rect x="160" y="38" width="1" height="1" />
      </g>
    </Frame>
  );
}

function MysteryScene() {
  return (
    <Frame>
      <defs>
        <radialGradient id="myst-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1a1408" />
          <stop offset="100%" stopColor="#0a0805" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#myst-glow)" />

      {/* Tomb mound */}
      <g transform="translate(160 110)">
        <polygon points="-80,40 0,-30 80,40" fill={PALETTE.shadow} />
        <polygon points="-60,40 0,-10 60,40" fill={PALETTE.ground} />
        <polygon points="-30,40 0,15 30,40" fill={PALETTE.ground2} />
        {/* Door */}
        <rect x="-10" y="20" width="20" height="20" fill={PALETTE.door} />
        <rect x="-8" y="22" width="16" height="16" fill={PALETTE.bg} />
      </g>

      {/* Mercury rivers — the mystery */}
      <g opacity="0.7">
        <path
          d="M 60 110 Q 100 95 160 105 T 260 110"
          stroke={PALETTE.mercury}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 70 120 Q 110 108 160 115 T 250 120"
          stroke={PALETTE.mercury}
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 80 130 Q 120 122 160 126 T 240 130"
          stroke={PALETTE.mercury}
          strokeWidth="0.8"
          fill="none"
        />
      </g>

      {/* Lock symbol floating above */}
      <g transform="translate(160 50)" stroke={PALETTE.gold} fill="none" strokeWidth="2">
        <rect x="-10" y="-2" width="20" height="14" fill={PALETTE.bg} />
        <path d="M -6 -2 V -8 a 6 6 0 0 1 12 0 V -2" />
        <rect x="-2" y="2" width="4" height="6" fill={PALETTE.gold} stroke="none" />
      </g>

      {/* Faint Chinese seal */}
      <g transform="translate(40 160)" fill={PALETTE.gold} opacity="0.4">
        <rect x="0" y="0" width="20" height="20" fill="none" stroke={PALETTE.gold} strokeWidth="1" />
        <rect x="3" y="3" width="14" height="2" />
        <rect x="3" y="9" width="14" height="2" />
        <rect x="3" y="15" width="14" height="2" />
      </g>
    </Frame>
  );
}