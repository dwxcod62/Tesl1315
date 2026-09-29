// Inline pixel-art SVG icons rendered with a uniform 16x16 grid.
// All icons use currentColor + a fixed palette so they can be themed via CSS.

export const PixelVolleyball = ({ size = 64, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    {/* Outer disc */}
    <rect x="3" y="2" width="10" height="1" fill="#f7f1d6" />
    <rect x="2" y="3" width="1" height="10" fill="#f7f1d6" />
    <rect x="13" y="3" width="1" height="10" fill="#f7f1d6" />
    <rect x="3" y="13" width="10" height="1" fill="#f7f1d6" />
    <rect x="2" y="3" width="11" height="1" fill="#f7f1d6" />
    <rect x="2" y="12" width="11" height="1" fill="#f7f1d6" />
    {/* Inner curves suggestion */}
    <rect x="3" y="4" width="10" height="1" fill="#c9a64a" opacity="0.6" />
    <rect x="3" y="11" width="10" height="1" fill="#c9a64a" opacity="0.6" />
    <rect x="4" y="3" width="1" height="10" fill="#c9a64a" opacity="0.6" />
    <rect x="11" y="3" width="1" height="10" fill="#c9a64a" opacity="0.6" />
    {/* Curved seams */}
    <rect x="5" y="6" width="6" height="1" fill="#c9a64a" />
    <rect x="6" y="9" width="4" height="1" fill="#c9a64a" />
    <rect x="6" y="5" width="1" height="2" fill="#c9a64a" />
    <rect x="9" y="5" width="1" height="2" fill="#c9a64a" />
    <rect x="5" y="7" width="1" height="2" fill="#c9a64a" />
    <rect x="10" y="7" width="1" height="2" fill="#c9a64a" />
    {/* Highlight pixel */}
    <rect x="5" y="4" width="2" height="1" fill="#ffffff" />
    <rect x="5" y="5" width="1" height="1" fill="#ffffff" />
  </svg>
);

export const PixelGlobe = ({ size = 28, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="3" y="2" width="10" height="1" fill="#4be9ff" />
    <rect x="2" y="3" width="1" height="10" fill="#4be9ff" />
    <rect x="13" y="3" width="1" height="10" fill="#4be9ff" />
    <rect x="3" y="13" width="10" height="1" fill="#4be9ff" />
    <rect x="2" y="3" width="11" height="1" fill="#4be9ff" />
    <rect x="2" y="12" width="11" height="1" fill="#4be9ff" />
    {/* Continents */}
    <rect x="5" y="5" width="3" height="1" fill="#6cff8a" />
    <rect x="4" y="6" width="2" height="2" fill="#6cff8a" />
    <rect x="9" y="6" width="3" height="1" fill="#6cff8a" />
    <rect x="10" y="7" width="2" height="2" fill="#6cff8a" />
    <rect x="6" y="9" width="4" height="1" fill="#6cff8a" />
    {/* Equator + meridian */}
    <rect x="3" y="7" width="10" height="1" fill="#1b1140" opacity="0.5" />
    <rect x="7" y="2" width="2" height="12" fill="#1b1140" opacity="0.5" />
    {/* Highlight */}
    <rect x="4" y="4" width="2" height="1" fill="#ffffff" />
    <rect x="4" y="5" width="1" height="1" fill="#ffffff" />
  </svg>
);

export const PixelHandshake = ({ size = 28, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    {/* Left arm */}
    <rect x="1" y="6" width="3" height="2" fill="#ffd83d" />
    <rect x="2" y="5" width="2" height="1" fill="#ffd83d" />
    <rect x="2" y="8" width="2" height="1" fill="#ffd83d" />
    {/* Right arm */}
    <rect x="12" y="6" width="3" height="2" fill="#ff7a1f" />
    <rect x="12" y="5" width="2" height="1" fill="#ff7a1f" />
    <rect x="12" y="8" width="2" height="1" fill="#ff7a1f" />
    {/* Grip */}
    <rect x="4" y="6" width="8" height="3" fill="#f7f1d6" />
    <rect x="5" y="5" width="6" height="1" fill="#f7f1d6" />
    <rect x="5" y="9" width="6" height="1" fill="#f7f1d6" />
    {/* Knuckles / fingers */}
    <rect x="6" y="7" width="1" height="1" fill="#c9a64a" />
    <rect x="8" y="7" width="1" height="1" fill="#c9a64a" />
    <rect x="10" y="7" width="1" height="1" fill="#c9a64a" />
    {/* Sparkle */}
    <rect x="7" y="3" width="2" height="1" fill="#ffffff" />
    <rect x="7" y="11" width="2" height="1" fill="#ffffff" />
  </svg>
);

export const PixelTrophy = ({ size = 28, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    {/* Cup */}
    <rect x="4" y="2" width="8" height="1" fill="#ffd83d" />
    <rect x="3" y="3" width="1" height="6" fill="#ffd83d" />
    <rect x="12" y="3" width="1" height="6" fill="#ffd83d" />
    <rect x="4" y="9" width="8" height="1" fill="#ffd83d" />
    <rect x="4" y="3" width="8" height="1" fill="#ffd83d" />
    <rect x="4" y="8" width="8" height="1" fill="#ffd83d" />
    {/* Inner shading */}
    <rect x="5" y="4" width="6" height="1" fill="#ff7a1f" opacity="0.5" />
    <rect x="5" y="5" width="6" height="1" fill="#ff7a1f" opacity="0.5" />
    {/* Handles */}
    <rect x="2" y="4" width="1" height="2" fill="#ffd83d" />
    <rect x="2" y="6" width="1" height="1" fill="#ffd83d" />
    <rect x="13" y="4" width="1" height="2" fill="#ffd83d" />
    <rect x="13" y="6" width="1" height="1" fill="#ffd83d" />
    {/* Stem */}
    <rect x="6" y="10" width="4" height="2" fill="#ff7a1f" />
    {/* Base */}
    <rect x="4" y="12" width="8" height="2" fill="#ff7a1f" />
    <rect x="3" y="14" width="10" height="1" fill="#c93a00" />
    {/* Star */}
    <rect x="7" y="4" width="2" height="2" fill="#ffffff" />
    <rect x="6" y="5" width="4" height="1" fill="#ffffff" />
  </svg>
);

export const PixelHeart = ({ size = 28, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="3" height="1" fill="#ff3d8b" />
    <rect x="10" y="4" width="3" height="1" fill="#ff3d8b" />
    <rect x="2" y="5" width="2" height="2" fill="#ff3d8b" />
    <rect x="4" y="5" width="8" height="1" fill="#ff3d8b" />
    <rect x="12" y="5" width="2" height="2" fill="#ff3d8b" />
    <rect x="2" y="7" width="12" height="1" fill="#ff3d8b" />
    <rect x="3" y="8" width="10" height="1" fill="#ff3d8b" />
    <rect x="4" y="9" width="8" height="1" fill="#ff3d8b" />
    <rect x="5" y="10" width="6" height="1" fill="#ff3d8b" />
    <rect x="6" y="11" width="4" height="1" fill="#ff3d8b" />
    <rect x="7" y="12" width="2" height="1" fill="#ff3d8b" />
    {/* Highlight */}
    <rect x="4" y="6" width="2" height="1" fill="#ffb1cf" />
    <rect x="4" y="7" width="1" height="1" fill="#ffb1cf" />
  </svg>
);

export const PixelBolt = ({ size = 28, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="7" y="1" width="3" height="1" fill="#ffd83d" />
    <rect x="6" y="2" width="3" height="1" fill="#ffd83d" />
    <rect x="8" y="2" width="2" height="1" fill="#ffd83d" />
    <rect x="5" y="3" width="3" height="1" fill="#ffd83d" />
    <rect x="8" y="3" width="2" height="1" fill="#ffd83d" />
    <rect x="4" y="4" width="3" height="1" fill="#ffd83d" />
    <rect x="8" y="4" width="2" height="1" fill="#ffd83d" />
    <rect x="5" y="5" width="3" height="1" fill="#ffd83d" />
    <rect x="8" y="5" width="2" height="1" fill="#ffd83d" />
    <rect x="6" y="6" width="2" height="1" fill="#ffd83d" />
    <rect x="7" y="7" width="2" height="1" fill="#ffd83d" />
    <rect x="8" y="8" width="2" height="1" fill="#ffd83d" />
    <rect x="9" y="9" width="2" height="1" fill="#ffd83d" />
    <rect x="10" y="10" width="2" height="1" fill="#ffd83d" />
    <rect x="11" y="11" width="2" height="1" fill="#ffd83d" />
    <rect x="6" y="10" width="2" height="1" fill="#ffd83d" />
    <rect x="5" y="11" width="2" height="1" fill="#ffd83d" />
    <rect x="4" y="12" width="2" height="1" fill="#ffd83d" />
    <rect x="3" y="13" width="2" height="1" fill="#ffd83d" />
    {/* Outline */}
    <rect x="9" y="6" width="1" height="1" fill="#ff7a1f" />
    <rect x="10" y="7" width="1" height="1" fill="#ff7a1f" />
    <rect x="11" y="8" width="1" height="1" fill="#ff7a1f" />
    <rect x="12" y="9" width="1" height="1" fill="#ff7a1f" />
    <rect x="13" y="10" width="1" height="1" fill="#ff7a1f" />
    <rect x="13" y="11" width="1" height="1" fill="#ff7a1f" />
  </svg>
);

export const PixelBall = ({ size = 22, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="3" y="2" width="10" height="1" fill="#f7f1d6" />
    <rect x="2" y="3" width="1" height="10" fill="#f7f1d6" />
    <rect x="13" y="3" width="1" height="10" fill="#f7f1d6" />
    <rect x="3" y="13" width="10" height="1" fill="#f7f1d6" />
    <rect x="2" y="3" width="11" height="1" fill="#f7f1d6" />
    <rect x="2" y="12" width="11" height="1" fill="#f7f1d6" />
    <rect x="5" y="6" width="6" height="1" fill="#c9a64a" />
    <rect x="6" y="9" width="4" height="1" fill="#c9a64a" />
    <rect x="6" y="5" width="1" height="2" fill="#c9a64a" />
    <rect x="9" y="5" width="1" height="2" fill="#c9a64a" />
    <rect x="5" y="7" width="1" height="2" fill="#c9a64a" />
    <rect x="10" y="7" width="1" height="2" fill="#c9a64a" />
    <rect x="5" y="4" width="2" height="1" fill="#ffffff" />
    <rect x="5" y="5" width="1" height="1" fill="#ffffff" />
  </svg>
);

export const PixelNet = ({ width = 320, height = 140, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={width}
    height={height}
    viewBox="0 0 80 36"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    {/* Posts */}
    <rect x="2" y="2" width="2" height="32" fill="#f7f1d6" />
    <rect x="76" y="2" width="2" height="32" fill="#f7f1d6" />
    {/* Top + bottom bands */}
    <rect x="2" y="2" width="76" height="2" fill="#f7f1d6" />
    <rect x="2" y="32" width="76" height="2" fill="#f7f1d6" />
    <rect x="2" y="6" width="76" height="1" fill="#f7f1d6" />
    <rect x="2" y="30" width="76" height="1" fill="#f7f1d6" />
    {/* Mesh */}
    {Array.from({ length: 11 }).map((_, i) => (
      <rect
        key={`v-${i}`}
        x={6 + i * 7}
        y="4"
        width="1"
        height="26"
        fill="#c9a64a"
        opacity="0.85"
      />
    ))}
    {Array.from({ length: 7 }).map((_, i) => (
      <rect
        key={`h-${i}`}
        x="4"
        y={8 + i * 4}
        width="72"
        height="1"
        fill="#c9a64a"
        opacity="0.85"
      />
    ))}
  </svg>
);

export const PixelStar = ({ size = 14, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={size}
    height={size}
    viewBox="0 0 8 8"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="3" y="0" width="2" height="1" fill="#ffd83d" />
    <rect x="2" y="1" width="4" height="1" fill="#ffd83d" />
    <rect x="0" y="2" width="8" height="2" fill="#ffd83d" />
    <rect x="1" y="4" width="6" height="2" fill="#ffd83d" />
    <rect x="0" y="6" width="2" height="1" fill="#ffd83d" />
    <rect x="3" y="6" width="2" height="1" fill="#ffd83d" />
    <rect x="6" y="6" width="2" height="1" fill="#ffd83d" />
    <rect x="3" y="7" width="2" height="1" fill="#ff7a1f" />
  </svg>
);

export const PixelSpark = ({ size = 10, className = '' }) => (
  <svg
    className={`pixelated ${className}`}
    width={size}
    height={size}
    viewBox="0 0 6 6"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="2" y="0" width="2" height="1" fill="#ffffff" />
    <rect x="1" y="1" width="4" height="1" fill="#ffffff" />
    <rect x="0" y="2" width="6" height="1" fill="#ffffff" />
    <rect x="1" y="3" width="4" height="1" fill="#ffffff" />
    <rect x="2" y="4" width="2" height="1" fill="#ffffff" />
  </svg>
);
