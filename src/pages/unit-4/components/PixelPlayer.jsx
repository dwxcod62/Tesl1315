/**
 * PixelPlayer — a tiny 8-bit volleyball player rendered purely with CSS.
 * Two visual variants (front row bigger, back row smaller).
 * Two team colors (cyan for Team A, pink for Team B).
 * Subtle idle + reactive jump animation synced to the ball via --jump-delay.
 */
export default function PixelPlayer({
  color = 'cyan',
  size = 'front',
  jumpDelay = '0s',
  label,
  showLabel = true,
}) {
  return (
    <div
      className={`player player--${size} player--${color}`}
      style={{ '--jump-delay': jumpDelay }}
    >
      <div className="player__body">
        <div className="player__head" />
        <div className="player__torso" />
        <div className="player__legs">
          <span className="player__leg player__leg--l" />
          <span className="player__leg player__leg--r" />
        </div>
        <div className="player__arm player__arm--l" />
        <div className="player__arm player__arm--r" />
      </div>
      {showLabel && label && <span className="player__label">{label}</span>}
    </div>
  );
}
