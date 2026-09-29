import { useEffect, useState } from 'react';
import { ALL_PLAYERS } from '../data/players';
import PixelPlayer from './PixelPlayer';

/**
 * Background — pixel-art volleyball arena.
 * Always rendered behind the UI. Doubles as the start-screen backdrop.
 *
 *  - Court lines + net
 *  - 20 pixel players positioned around the court
 *  - Animated volleyball whose position is driven by React state (App → useRally)
 *  - Subtle pixel particles
 *
 * Player (x, y, isJumping) are also React-controlled via `playerFrames`
 * so we can show each player moving to receive/set/spike/block during
 * a rally.
 */
export default function Background({
  showPlayers = true,
  showLabels = true,
  ball = { x: 4, y: 92, rotation: 0, visible: true },
  impact = null,
  playerFrames = null,
  reducedMotion = false,
}) {
  // Particle positions — stable per mount.
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 67 + 11) % 96}%`,
    top: `${(i * 41 + 18) % 78}%`,
    delay: `${(i % 7) * 0.6}s`,
    dur: `${6 + ((i * 13) % 7)}s`,
    size: 1 + ((i * 7) % 3),
    op: 0.18 + ((i * 11) % 5) * 0.05,
  }));

  // Lookup a player's current frame (default to their home position).
  const getFrame = (player) => {
    if (playerFrames && playerFrames.has(player.name)) {
      return playerFrames.get(player.name);
    }
    return { x: player.x, y: player.y, isJumping: false };
  };

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__sky" />

      <div className="bg__stars">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="bg__star"
            style={{
              left: `${(i * 137 + 20) % 95}%`,
              top: `${(i * 53 + 8) % 35}%`,
              opacity: 0.25 + ((i % 4) * 0.08),
            }}
          />
        ))}
      </div>

      {/* ---------- Pixel-art volleyball court ---------- */}
      <div className="bg__court">
        <div className="court__floor" />

        {/* Court lines */}
        <svg
          className="court__svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect
            x="60" y="60" width="880" height="480"
            fill="none"
            stroke="rgba(255,216,61,0.18)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <line x1="60" y1="300" x2="940" y2="300"
            stroke="rgba(255,216,61,0.14)" strokeWidth="2" strokeDasharray="4 8" />
          <line x1="498" y1="296" x2="502" y2="304"
            stroke="rgba(255,216,61,0.30)" strokeWidth="2" />
          <line x1="260" y1="80" x2="260" y2="520"
            stroke="rgba(255,216,61,0.10)" strokeWidth="2" strokeDasharray="2 6" />
          <line x1="740" y1="80" x2="740" y2="520"
            stroke="rgba(255,216,61,0.10)" strokeWidth="2" strokeDasharray="2 6" />
          <line x1="180" y1="80" x2="180" y2="520"
            stroke="rgba(255,216,61,0.07)" strokeWidth="1" />
          <line x1="820" y1="80" x2="820" y2="520"
            stroke="rgba(255,216,61,0.07)" strokeWidth="1" />
        </svg>

        {/* Net */}
        <div className="court__net">
          <div className="net__post net__post--left" />
          <div className="net__mesh" />
          <div className="net__post net__post--right" />
          <div className="net__top" />
        </div>

        {/* Court shadow ellipse */}
        <div className="court__shadow" />

        {/* ---------- Players ---------- */}
        {showPlayers && (
          <div className="court__players">
            {ALL_PLAYERS.map((p) => {
              const f = getFrame(p);
              return (
                <div
                  key={p.name}
                  className={`player-slot player-slot--${p.role} ${f.isJumping ? 'is-jumping' : ''}`}
                  data-pos={p.position}
                  style={{
                    left: `${f.x}%`,
                    top: `${f.y}%`,
                  }}
                >
                  <PixelPlayer
                    color={p.side === 'A' ? 'cyan' : 'pink'}
                    size={p.role}
                    label={p.name}
                    showLabel={showLabels}
                  />
                </div>
              );
            })}

            {/* ---------- Animated ball (React-driven) ---------- */}
            {!reducedMotion && ball.visible && (
              <>
                <div
                  className="ball__trail"
                  style={{
                    left: `${ball.x}%`,
                    top: `${ball.y}%`,
                  }}
                />
                <div
                  className="ball"
                  style={{
                    left: `${ball.x}%`,
                    top: `${ball.y}%`,
                  }}
                >
                  <span className="ball__pixel" />
                </div>
              </>
            )}

            {/* Impact burst at landing point */}
            {impact && (
              <div
                key={impact.id}
                className={`ball-impact ball-impact--${impact.side === 'A' ? 'cyan' : 'pink'}`}
                style={{ left: `${impact.x}%`, top: `${impact.y}%` }}
              >
                <span className="ball-impact__ring" />
                <span className="ball-impact__ring ball-impact__ring--delay" />
                <span className="ball-impact__label">+1 {impact.side}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg__particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: reducedMotion ? 0 : p.op,
              animationDuration: p.dur,
              animationDelay: p.delay,
              animationPlayState: reducedMotion ? 'paused' : 'running',
            }}
          />
        ))}
      </div>
    </div>
  );
}
