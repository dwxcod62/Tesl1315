import { useEffect, useRef, useState } from 'react';
import '../styles/scoreboard.css';

/**
 * Scoreboard — retro arcade-style volleyball HUD.
 *
 * Props:
 *   teamA / teamB  – array of { name, position }
 *   scoreA / scoreB – current score (controlled)
 *   set             – current set number as string ('02')
 *   servingTeam     – 'A' | 'B'
 *   log             – recent rally results [{ id, side, label }]
 */
export default function Scoreboard({
  teamA = [],
  teamB = [],
  scoreA = 0,
  scoreB = 0,
  set = '02',
  servingTeam = 'A',
  log = [],
}) {
  // Track score changes to trigger a brief bump animation.
  const prevA = useRef(scoreA);
  const prevB = useRef(scoreB);
  const [bumpA, setBumpA] = useState(false);
  const [bumpB, setBumpB] = useState(false);

  // Most-recent scorer (highlighted in roster for ~3s)
  const [recentScorer, setRecentScorer] = useState(null);
  useEffect(() => {
    if (log.length === 0) return;
    const top = log[0];
    if (top?.scorer) {
      setRecentScorer(top.scorer);
      const tid = setTimeout(() => setRecentScorer((s) => (s === top.scorer ? null : s)), 3200);
      return () => clearTimeout(tid);
    }
  }, [log]);

  useEffect(() => {
    if (scoreA !== prevA.current) {
      setBumpA(true);
      prevA.current = scoreA;
      const tid = setTimeout(() => setBumpA(false), 700);
      return () => clearTimeout(tid);
    }
  }, [scoreA]);

  useEffect(() => {
    if (scoreB !== prevB.current) {
      setBumpB(true);
      prevB.current = scoreB;
      const tid = setTimeout(() => setBumpB(false), 700);
      return () => clearTimeout(tid);
    }
  }, [scoreB]);

  return (
    <aside className="scoreboard" aria-label="Match scoreboard">
      <header className="scoreboard__head">
        <span className="scoreboard__chip">LIVE</span>
        <span className="scoreboard__title">COMMUNITY MATCH</span>
        <span className="scoreboard__set">SET {set}</span>
      </header>

      <div className="scoreboard__match">
        <div
          className={`scoreboard__team scoreboard__team--a ${servingTeam === 'A' ? 'is-serving' : ''}`}
        >
          <div className="scoreboard__team-row">
            <span className="scoreboard__team-name">TEAM A</span>
            {servingTeam === 'A' && <span className="scoreboard__ball-glyph" aria-hidden="true">●</span>}
          </div>
          <div className={`scoreboard__team-score ${bumpA ? 'is-bumping' : ''}`}>
            {String(scoreA).padStart(2, '0')}
          </div>
          <ul className="scoreboard__roster">
            {teamA.map((p) => (
              <li
                key={p.name}
                className={recentScorer === p.name ? 'is-recent-scorer' : ''}
              >
                <span className="scoreboard__roster-name">{p.name}</span>
                {p.position && p.position !== 'hitter' && (
                  <span className={`scoreboard__pos scoreboard__pos--${p.position}`}>
                    {p.position.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="scoreboard__vs" aria-hidden="true">VS</div>

        <div
          className={`scoreboard__team scoreboard__team--b ${servingTeam === 'B' ? 'is-serving' : ''}`}
        >
          <div className="scoreboard__team-row">
            <span className="scoreboard__team-name">TEAM B</span>
            {servingTeam === 'B' && <span className="scoreboard__ball-glyph" aria-hidden="true">●</span>}
          </div>
          <div className={`scoreboard__team-score ${bumpB ? 'is-bumping' : ''}`}>
            {String(scoreB).padStart(2, '0')}
          </div>
          <ul className="scoreboard__roster">
            {teamB.map((p) => (
              <li
                key={p.name}
                className={recentScorer === p.name ? 'is-recent-scorer' : ''}
              >
                <span className="scoreboard__roster-name">{p.name}</span>
                {p.position && p.position !== 'hitter' && (
                  <span className={`scoreboard__pos scoreboard__pos--${p.position}`}>
                    {p.position.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rally log — most recent first. Each row: scorer + point type. */}
      <div className="scoreboard__log" aria-live="polite">
        <span className="scoreboard__log-head">RALLY LOG</span>
        <ul className="scoreboard__log-list">
          {log.length === 0 && (
            <li className="scoreboard__log-empty">— MATCH STARTED —</li>
          )}
          {log.map((entry) => (
            <li
              key={entry.id}
              className={`scoreboard__log-row scoreboard__log-row--${entry.side === 'A' ? 'cyan' : 'pink'} scoreboard__log-row--${entry.pointType?.toLowerCase() || 'kill'}`}
            >
              <span className="scoreboard__log-arrow">▲</span>
              <span className="scoreboard__log-side">TEAM {entry.side}</span>
              <span className="scoreboard__log-scorer">{entry.scorer || '—'}</span>
              <span className={`scoreboard__log-type scoreboard__log-type--${entry.pointType?.toLowerCase() || 'kill'}`}>
                {entry.pointType || 'KILL'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
