import { useEffect, useRef, useState, useCallback } from 'react';
import {
  RALLY_DURATION,
  ALL_PLAYERS,
  getRallyInfo,
} from '../data/players';

/**
 * useRally — drives a continuous volleyball match:
 *   - cycles through a catalog of 9 rally variants (different outcomes)
 *   - positions the ball along the chosen variant's waypoints
 *   - positions each player along their own motion keyframes
 *   - at impact (ball lands), emits a scored-by entry with the player's
 *     name, point type (KILL/BLOCK/ACE/ATTACK_ERR/SERVICE_ERR), and side
 *   - increments the score of the winning team
 *   - fires impact events for VFX (+1 label)
 *
 * Returns:
 *   ball          – { x, y, visible, rotation }
 *   impact        – { id, x, y, side, label } | null (one-shot)
 *   scoreA, scoreB
 *   setNumber
 *   log           – [{ id, side, label, scorer, pointType }, ...] (last 5)
 *   servingTeam   – 'A' | 'B'
 *   playerFrames  – Map<name, { x, y, isJumping }>
 */
export default function useRally({ active = true, reducedMotion = false } = {}) {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [log, setLog] = useState([]); // { id, side, label, scorer, pointType }
  const [ball, setBall] = useState({ x: 4, y: 92, rotation: 0, visible: true });
  const [impact, setImpact] = useState(null);
  const [servingTeam, setServingTeam] = useState('A');
  const [playerFrames, setPlayerFrames] = useState(() => {
    const m = new Map();
    ALL_PLAYERS.forEach((p) => m.set(p.name, { x: p.x, y: p.y, isJumping: false }));
    return m;
  });

  const stateRef = useRef({
    t0: performance.now(),
    lastImpactId: -1,
    lastRallyIndex: -1,
    paused: !active || reducedMotion,
    jumpMarkers: new Map(),
  });

  // Reset everything when active flips on (after Start Match)
  const wasActive = useRef(active);
  useEffect(() => {
    stateRef.current.paused = !active || reducedMotion;
    if (active && !wasActive.current) {
      stateRef.current.t0 = performance.now();
      stateRef.current.lastImpactId = -1;
      stateRef.current.lastRallyIndex = -1;
      stateRef.current.jumpMarkers.clear();
      setScoreA(0);
      setScoreB(0);
      setSetNumber(1);
      setLog([]);
      setImpact(null);
      setServingTeam('A');
      const home = new Map();
      ALL_PLAYERS.forEach((p) => home.set(p.name, { x: p.x, y: p.y, isJumping: false }));
      setPlayerFrames(home);
    }
    wasActive.current = active;
  }, [active, reducedMotion]);

  const appendLog = useCallback((entry) => {
    setLog((prev) => [entry, ...prev].slice(0, 5));
  }, []);

  const scoreFor = useCallback((side, rallyInfo) => {
    if (side === 'A') setScoreA((s) => s + 1);
    else setScoreB((s) => s + 1);

    // Log entry — "Kudamii Nguyen · KILL"
    const scorer = rallyInfo.scorerName;
    const pointType = rallyInfo.pointType;
    appendLog({
      id: performance.now() + Math.random(),
      side,
      label: `${side} +1`,
      scorer,
      pointType,
      fullLabel: `${scorer} · ${pointType}`,
    });
  }, [appendLog]);

  // ----- Set completion: 25-pt sets, win by 2 -----
  useEffect(() => {
    const aWins = scoreA >= 25 && scoreA - scoreB >= 2;
    const bWins = scoreB >= 25 && scoreB - scoreA >= 2;
    if (!aWins && !bWins) return;
    const tid = setTimeout(() => {
      setSetNumber((s) => s + 1);
    }, 1200);
    return () => clearTimeout(tid);
  }, [scoreA, scoreB]);

  // Helper: interpolate a list of keyframes {t, x, y} at time `tNow`.
  const interpolate = (keyframes, tNow) => {
    if (!keyframes || keyframes.length === 0) return null;
    if (tNow <= keyframes[0].t) return keyframes[0];
    for (let i = 1; i < keyframes.length; i++) {
      const a = keyframes[i - 1];
      const b = keyframes[i];
      if (tNow < b.t) {
        const span = b.t - a.t;
        const local = span > 0 ? (tNow - a.t) / span : 0;
        const eased = local * local * (3 - 2 * local);
        return {
          t: tNow,
          x: a.x + (b.x - a.x) * eased,
          y: a.y + (b.y - a.y) * eased,
        };
      }
    }
    return keyframes[keyframes.length - 1];
  };

  // ----- Main animation loop -----
  useEffect(() => {
    if (!active || reducedMotion) return;
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const elapsedSinceStart = (now - stateRef.current.t0) / 1000;
      const rallyIndex = Math.floor(elapsedSinceStart / RALLY_DURATION);
      const tInRally = elapsedSinceStart - rallyIndex * RALLY_DURATION;

      const rallyInfo = getRallyInfo(rallyIndex);
      const ballWaypoints = rallyInfo.waypoints;
      const last = ballWaypoints[ballWaypoints.length - 1];

      if (rallyIndex !== stateRef.current.lastRallyIndex) {
        stateRef.current.lastRallyIndex = rallyIndex;
        setServingTeam(rallyInfo.servingTeam);
      }

      const ballPos = interpolate(ballWaypoints, tInRally) || last;
      const rot = ((now / 1000) * 240) % 360;
      setBall({
        x: ballPos.x,
        y: ballPos.y,
        rotation: rot,
        visible: tInRally < last.t + 0.6,
      });

      // ----- Player motion: each player has its own moves[] timeline -----
      const lastSample = stateRef.current.lastSample || 0;
      if (now - lastSample > 80) {
        stateRef.current.lastSample = now;
        const next = new Map();
        ALL_PLAYERS.forEach((p) => {
          const pos = interpolate(p.moves, tInRally) || { x: p.x, y: p.y };
          let jumping = false;
          for (const t of p.jumpAt || []) {
            if (Math.abs(tInRally - t) < 0.15) {
              jumping = true;
              break;
            }
          }
          next.set(p.name, { x: pos.x, y: pos.y, isJumping: jumping });
        });
        setPlayerFrames(next);
      }

      // ----- Fire impact event at t = last.t of every rally -----
      const impactId = rallyIndex;
      if (tInRally >= last.t && impactId !== stateRef.current.lastImpactId) {
        stateRef.current.lastImpactId = impactId;

        const winnerSide = rallyInfo.scorerSide;
        scoreFor(winnerSide, rallyInfo);

        setImpact({
          id: performance.now() + Math.random(),
          x: last.x,
          y: last.y,
          side: winnerSide,
          label: `${rallyInfo.pointType}`,
        });

        setTimeout(() => setImpact(null), 1400);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reducedMotion, scoreFor]);

  return { ball, impact, scoreA, scoreB, setNumber, log, servingTeam, playerFrames };
}
