/**
 * Volleyball rosters + positions.
 *
 * Two teams of 10. Positions are expressed in percentage of the
 * arena container (the band between the panels row and the footer).
 *
 * field role (front/back)  – visual row (front = closer = bigger)
 * position (volleyball)    – setter / hitter / blocker / libero / server
 * side (A / B)             – jersey color (cyan / pink)
 *
 * jumpAt – seconds within the rally at which the player does a small
 *          vertical jump (reactive spike / block / dig).
 *
 * moves  – array of { t, x, y } keyframes. The player's home position
 *          is the FIRST entry; subsequent entries are intermediate
 *          positions they pass through during the rally. Interpolated
 *          by useRally. Returning to home is implicit (loop restarts).
 */

// Helper for x mirroring (so we only write one set of waypoints per side)
const flip = (wp) => ({ t: wp.t, x: 100 - wp.x, y: wp.y });

// ============================================================
// TEAM A
// ============================================================
export const TEAM_A = [
  // Adam is the A team's primary server
  { name: 'Adam Dazi',            role: 'front', position: 'server',  side: 'A',
    x:  4, y: 86,
    jumpAt: [0.0, 6.0], // serves rally 1 AND serves rally 4 (alt cycles)
    moves: [
      { t: 0.0, x:  4, y: 86 },
      { t: 0.5, x:  6, y: 80 },
      { t: 1.0, x:  8, y: 76 },
    ] },
  { name: 'Shirley Alfaro',       role: 'back',  position: 'libero',  side: 'A',
    x: 18, y: 78,
    jumpAt: [2.0],
    moves: [
      { t: 0.0, x: 18, y: 78 },
      { t: 1.5, x: 32, y: 82 },
      { t: 2.4, x: 38, y: 84 },
      { t: 3.0, x: 32, y: 82 },
      { t: 4.0, x: 22, y: 78 },
    ] },
  { name: 'Yerardin Chourio',     role: 'front', position: 'setter',  side: 'A',
    x: 26, y: 56,
    jumpAt: [3.2],
    moves: [
      { t: 0.0, x: 26, y: 56 },
      { t: 2.4, x: 36, y: 60 },
      { t: 3.2, x: 36, y: 60 },
      { t: 4.0, x: 28, y: 56 },
    ] },
  // Maria is the A team's primary hitter (will score KILL on rally 4)
  { name: 'Maria Cortes',         role: 'back',  position: 'hitter',  side: 'A',
    x: 32, y: 80,
    jumpAt: [4.0, 4.2],
    moves: [
      { t: 0.0, x: 32, y: 80 },
      { t: 3.6, x: 36, y: 70 },
      { t: 4.0, x: 38, y: 60 },
      { t: 4.2, x: 38, y: 50 },
      { t: 4.6, x: 36, y: 70 },
      { t: 5.0, x: 32, y: 80 },
    ] },
  // Obed is the A team's blocker who will score BLOCK on rally 2
  { name: 'Obed Figuera',         role: 'front', position: 'blocker', side: 'A',
    x: 38, y: 44,
    jumpAt: [4.2, 4.4],
    moves: [
      { t: 0.0, x: 38, y: 44 },
      { t: 3.8, x: 44, y: 42 },
      { t: 4.2, x: 46, y: 38 },
      { t: 4.6, x: 44, y: 42 },
      { t: 5.2, x: 38, y: 44 },
    ] },
  // Grisbeth = secondary blocker (for visual density at the net)
  { name: 'Grisbeth Dam',         role: 'front', position: 'blocker', side: 'A',
    x: 30, y: 42,
    jumpAt: [4.2, 4.4],
    moves: [
      { t: 0.0, x: 30, y: 42 },
      { t: 3.8, x: 40, y: 40 },
      { t: 4.2, x: 42, y: 36 },
      { t: 4.6, x: 40, y: 40 },
      { t: 5.2, x: 30, y: 42 },
    ] },
  { name: 'Yina Damian',          role: 'back',  position: 'hitter',  side: 'A',
    x: 22, y: 66,
    jumpAt: [4.4],
    moves: [
      { t: 0.0, x: 22, y: 66 },
      { t: 3.6, x: 26, y: 64 },
      { t: 4.4, x: 30, y: 58 },
      { t: 5.0, x: 22, y: 66 },
    ] },
  { name: 'Marianely De La Rosa', role: 'front', position: 'setter',  side: 'A',
    x: 14, y: 60,
    jumpAt: [1.6],
    moves: [
      { t: 0.0, x: 14, y: 60 },
      { t: 1.0, x: 16, y: 58 },
      { t: 1.6, x: 18, y: 58 },
      { t: 2.4, x: 14, y: 60 },
    ] },
  { name: 'Miguel Deudor',        role: 'back',  position: 'libero',  side: 'A',
    x:  8, y: 70,
    jumpAt: [4.6],
    moves: [
      { t: 0.0, x:  8, y: 70 },
      { t: 4.0, x: 20, y: 78 },
      { t: 4.6, x: 24, y: 82 },
      { t: 5.4, x:  8, y: 70 },
    ] },
  { name: 'CHESHIRA Gonzales',    role: 'back',  position: 'hitter',  side: 'A',
    x: 36, y: 84,
    jumpAt: [4.4],
    moves: [
      { t: 0.0, x: 36, y: 84 },
      { t: 3.6, x: 40, y: 74 },
      { t: 4.4, x: 42, y: 60 },
      { t: 5.0, x: 36, y: 84 },
    ] },
];

// ============================================================
// TEAM B (same pattern, mirrored x)
// ============================================================
export const TEAM_B = [
  // Thania = B server
  { name: 'THANIA Gonzales',      role: 'front', position: 'server',  side: 'B',
    x: 96, y: 86,
    jumpAt: [6.0],
    moves: [
      { t: 0.0, x: 96, y: 86 },
      { t: 0.5, x: 94, y: 80 },
      { t: 1.0, x: 92, y: 76 },
    ] },
  { name: 'Ludmi Liberattore',    role: 'back',  position: 'libero',  side: 'B',
    x: 82, y: 78,
    jumpAt: [2.0],
    moves: [
      { t: 0.0, x: 82, y: 78 },
      { t: 1.5, x: 68, y: 82 },
      { t: 2.4, x: 62, y: 84 },
      { t: 3.0, x: 68, y: 82 },
      { t: 4.0, x: 82, y: 78 },
    ] },
  { name: 'Kap Lian Mang',        role: 'front', position: 'setter',  side: 'B',
    x: 74, y: 56,
    jumpAt: [3.2],
    moves: [
      { t: 0.0, x: 74, y: 56 },
      { t: 2.4, x: 64, y: 60 },
      { t: 3.2, x: 64, y: 60 },
      { t: 4.0, x: 72, y: 56 },
    ] },
  // Kudamii = B primary hitter (scores KILL on rally 1)
  { name: 'Kudamii Nguyen',       role: 'back',  position: 'hitter',  side: 'B',
    x: 68, y: 80,
    jumpAt: [4.0, 4.2],
    moves: [
      { t: 0.0, x: 68, y: 80 },
      { t: 3.6, x: 64, y: 70 },
      { t: 4.0, x: 62, y: 60 },
      { t: 4.2, x: 62, y: 50 },
      { t: 4.6, x: 64, y: 70 },
      { t: 5.0, x: 68, y: 80 },
    ] },
  // Tomas = B secondary blocker
  { name: 'Tomas Ortiz',          role: 'front', position: 'blocker', side: 'B',
    x: 70, y: 42,
    jumpAt: [4.2, 4.4],
    moves: [
      { t: 0.0, x: 70, y: 42 },
      { t: 3.8, x: 60, y: 40 },
      { t: 4.2, x: 58, y: 36 },
      { t: 4.6, x: 60, y: 40 },
      { t: 5.2, x: 70, y: 42 },
    ] },
  // Eliseo = B primary blocker (will score BLOCK on rally 3)
  { name: 'Eliseo Robles',        role: 'front', position: 'blocker', side: 'B',
    x: 62, y: 44,
    jumpAt: [4.2, 4.4],
    moves: [
      { t: 0.0, x: 62, y: 44 },
      { t: 3.8, x: 56, y: 42 },
      { t: 4.2, x: 54, y: 38 },
      { t: 4.6, x: 56, y: 42 },
      { t: 5.2, x: 62, y: 44 },
    ] },
  { name: 'Ketsaraporn Patthum',  role: 'back',  position: 'hitter',  side: 'B',
    x: 78, y: 66,
    jumpAt: [4.4],
    moves: [
      { t: 0.0, x: 78, y: 66 },
      { t: 3.6, x: 74, y: 64 },
      { t: 4.4, x: 70, y: 58 },
      { t: 5.0, x: 78, y: 66 },
    ] },
  { name: 'Mia Perez',            role: 'front', position: 'setter',  side: 'B',
    x: 86, y: 60,
    jumpAt: [1.6],
    moves: [
      { t: 0.0, x: 86, y: 60 },
      { t: 1.0, x: 84, y: 58 },
      { t: 1.6, x: 82, y: 58 },
      { t: 2.4, x: 86, y: 60 },
    ] },
  { name: 'Isabela Resch',        role: 'back',  position: 'libero',  side: 'B',
    x: 92, y: 70,
    jumpAt: [4.6],
    moves: [
      { t: 0.0, x: 92, y: 70 },
      { t: 4.0, x: 80, y: 78 },
      { t: 4.6, x: 76, y: 82 },
      { t: 5.4, x: 92, y: 70 },
    ] },
  { name: 'Melissa Serrano',      role: 'back',  position: 'hitter',  side: 'B',
    x: 64, y: 84,
    jumpAt: [4.4],
    moves: [
      { t: 0.0, x: 64, y: 84 },
      { t: 3.6, x: 60, y: 74 },
      { t: 4.4, x: 58, y: 60 },
      { t: 5.0, x: 64, y: 84 },
    ] },
];

export const ALL_PLAYERS = [...TEAM_A, ...TEAM_B];

// ============================================================
// RALLY CATALOG
// Each rally variant has its own waypoints (the ball path), an
// outcome (which side scores, what kind of point, and which player
// is the scorer).
//
// rallyIndex cycles 0,1,2,3,4,5...
// We pick a variant deterministically: index % VARIANTS.length
//
// Variants:
//   0: A-serve → B reception → B set → B spike KILL → B scores (B hitter)
//   1: B-serve → A reception → A set → A spike BLOCKED by Obed → A scores (Obed BLOCK)
//   2: A-serve → ACE → B libero didn't reach → B scores (A server = Adam ACE... wait, A scores on own ace?)
// Actually: serve lands untouched on OPPONENT's court → server scores.
//   2: B-serve → ACE → A libero didn't reach → B scores (Thania server)
//   3: A-serve → B reception → B set → B spike ATTACK ERROR → A scores (A libero = Shirley)
//   4: B-serve → A reception → A set → A spike KILL → A scores (Maria KILL)
//   5: A-serve → B reception → B set → B spike BLOCKED by Eliseo → B scores (Eliseo BLOCK)
//   6: B-serve → SERVICE ERROR → A libero dug it → A scores (A libero)
// ============================================================

export const RALLY_DURATION = 12; // seconds per rally

/** Build waypoints for an A-serve rally variant. The ball starts on
 *  the A-server side, gets tossed, served, and follows one of several
 *  paths depending on outcome. */
function buildAWaypoints(outcome) {
  switch (outcome) {
    case 'KILL_BY_B':
      // A serves, B passes, B sets, B spikes (Kudamii), ball lands in A
      return [
        { t: 0.0, x:  4, y: 92 },  // server toss
        { t: 0.8, x: 14, y: 60 },  // ball up
        { t: 1.6, x: 24, y: 84 },  // serve hit, ball flying
        { t: 2.4, x: 42, y: 50 },  // arc apex (over net)
        { t: 3.2, x: 58, y: 78 },  // B reception
        { t: 3.8, x: 70, y: 82 },  // dig low
        { t: 4.6, x: 76, y: 56 },  // B set up
        { t: 5.2, x: 70, y: 22 },  // spike jumps
        { t: 5.6, x: 56, y: 36 },  // spikes over net
        { t: 6.0, x: 30, y: 88 },  // LAND in A court
      ];
    case 'BLOCK_BY_A':
      // A serves, B passes/sets/spikes, A BLOCKS (Obed), ball lands in B
      return [
        { t: 0.0, x:  4, y: 92 },
        { t: 0.8, x: 14, y: 60 },
        { t: 1.6, x: 24, y: 84 },
        { t: 2.4, x: 42, y: 50 },
        { t: 3.2, x: 58, y: 78 },
        { t: 3.8, x: 70, y: 82 },
        { t: 4.6, x: 76, y: 56 },
        { t: 5.2, x: 70, y: 22 },
        { t: 5.5, x: 50, y: 36 }, // spike meets block at net
        { t: 5.8, x: 70, y: 80 }, // deflects back into B court (BLOCK by Obed)
      ];
    case 'ACE_BY_A':
      // A serves, B libero doesn't reach → ball lands in B court
      return [
        { t: 0.0, x:  4, y: 92 },
        { t: 0.8, x: 14, y: 60 },
        { t: 1.6, x: 24, y: 84 },
        { t: 2.4, x: 42, y: 50 },
        { t: 3.6, x: 64, y: 92 }, // ball flies to B back line — untouched
      ];
    case 'ATTACK_ERR_B':
      // A serves, B passes/sets/spikes OUT (hits outside B's reach)
      return [
        { t: 0.0, x:  4, y: 92 },
        { t: 0.8, x: 14, y: 60 },
        { t: 1.6, x: 24, y: 84 },
        { t: 2.4, x: 42, y: 50 },
        { t: 3.2, x: 58, y: 78 },
        { t: 3.8, x: 70, y: 82 },
        { t: 4.6, x: 76, y: 56 },
        { t: 5.2, x: 70, y: 22 },
        { t: 5.6, x: 56, y: 36 },
        { t: 6.0, x: 44, y: 90 }, // OUT (B's spike hit just inside A line — but A passes, then dig fails)
      ];
    case 'BLOCK_BY_B':
      // A serves, B passes/sets/spikes, B's Eliseo BLOCKS, ball lands in A
      return [
        { t: 0.0, x:  4, y: 92 },
        { t: 0.8, x: 14, y: 60 },
        { t: 1.6, x: 24, y: 84 },
        { t: 2.4, x: 42, y: 50 },
        { t: 3.2, x: 58, y: 78 },
        { t: 3.8, x: 70, y: 82 },
        { t: 4.6, x: 76, y: 56 },
        { t: 5.2, x: 70, y: 22 },
        { t: 5.5, x: 50, y: 40 }, // spike meets block at net (B blocker = Eliseo)
        { t: 5.8, x: 32, y: 90 }, // deflects back into A court
      ];
    case 'SERVICE_ERR_A':
      // A serves, ball hits net / goes out → A loses serve, B scores
      // Ball: starts at A server, goes over net, but lands short or hits net
      return [
        { t: 0.0, x:  4, y: 92 },
        { t: 0.8, x: 14, y: 60 },
        { t: 1.6, x: 24, y: 84 },
        { t: 2.4, x: 42, y: 50 },
        { t: 3.2, x: 50, y: 88 }, // ball hits net (lands at center, A's side — A error)
      ];
    default:
      return buildAWaypoints('KILL_BY_B');
  }
}

function buildBWaypoints(outcome) {
  // Same outcomes but mirrored horizontally
  switch (outcome) {
    case 'KILL_BY_A':
      // B serves, A passes/sets/spikes (Maria), lands in B court
      return [
        { t: 0.0, x: 96, y: 92 },
        { t: 0.8, x: 86, y: 60 },
        { t: 1.6, x: 76, y: 84 },
        { t: 2.4, x: 58, y: 50 },
        { t: 3.2, x: 42, y: 78 },
        { t: 3.8, x: 30, y: 82 },
        { t: 4.6, x: 24, y: 56 },
        { t: 5.2, x: 30, y: 22 },
        { t: 5.6, x: 44, y: 36 },
        { t: 6.0, x: 70, y: 88 },
      ];
    case 'BLOCK_BY_B':
      // B serves, A spikes, B's Eliseo blocks → lands in A
      return [
        { t: 0.0, x: 96, y: 92 },
        { t: 0.8, x: 86, y: 60 },
        { t: 1.6, x: 76, y: 84 },
        { t: 2.4, x: 58, y: 50 },
        { t: 3.2, x: 42, y: 78 },
        { t: 3.8, x: 30, y: 82 },
        { t: 4.6, x: 24, y: 56 },
        { t: 5.2, x: 30, y: 22 },
        { t: 5.5, x: 50, y: 36 },
        { t: 5.8, x: 70, y: 80 }, // lands in B court (Eliseo BLOCK scores for B)
      ];
    case 'ACE_BY_B':
      // B serves, A libero doesn't reach
      return [
        { t: 0.0, x: 96, y: 92 },
        { t: 0.8, x: 86, y: 60 },
        { t: 1.6, x: 76, y: 84 },
        { t: 2.4, x: 58, y: 50 },
        { t: 3.6, x: 36, y: 92 }, // untouched landing in A
      ];
    case 'ATTACK_ERR_A':
      // B serves, A spikes out → B scores
      return [
        { t: 0.0, x: 96, y: 92 },
        { t: 0.8, x: 86, y: 60 },
        { t: 1.6, x: 76, y: 84 },
        { t: 2.4, x: 58, y: 50 },
        { t: 3.2, x: 42, y: 78 },
        { t: 3.8, x: 30, y: 82 },
        { t: 4.6, x: 24, y: 56 },
        { t: 5.2, x: 30, y: 22 },
        { t: 5.6, x: 44, y: 36 },
        { t: 6.0, x: 56, y: 90 },
      ];
    case 'SERVICE_ERR_B':
      // B serves into net → A scores (A libero = Shirley)
      return [
        { t: 0.0, x: 96, y: 92 },
        { t: 0.8, x: 86, y: 60 },
        { t: 1.6, x: 76, y: 84 },
        { t: 2.4, x: 58, y: 50 },
        { t: 3.2, x: 50, y: 88 }, // hits net, lands at center on B's side (B error)
      ];
    case 'BLOCK_BY_A':
      // B serves, A spikes, A's Obed blocks → lands in B
      return [
        { t: 0.0, x: 96, y: 92 },
        { t: 0.8, x: 86, y: 60 },
        { t: 1.6, x: 76, y: 84 },
        { t: 2.4, x: 58, y: 50 },
        { t: 3.2, x: 42, y: 78 },
        { t: 3.8, x: 30, y: 82 },
        { t: 4.6, x: 24, y: 56 },
        { t: 5.2, x: 30, y: 22 },
        { t: 5.5, x: 50, y: 40 },
        { t: 5.8, x: 68, y: 90 }, // deflects into B court (Obed BLOCK scores for A)
      ];
    default:
      return buildBWaypoints('KILL_BY_A');
  }
}

// Rally catalog — deterministic cycle so users see variety
// Each entry: { servingTeam, outcome, scorerName, scorerSide, pointType }
//   pointType: 'KILL' | 'BLOCK' | 'ACE' | 'ATTACK_ERR' | 'SERVICE_ERR'
//
// The roster maps to these by name lookup.
export const RALLY_CATALOG = [
  // 0 — A serves, Kudamii spikes KILL (B scores)
  { servingTeam: 'A', outcome: 'KILL_BY_B',
    scorerName: 'Kudamii Nguyen', scorerSide: 'B', pointType: 'KILL' },
  // 1 — B serves, Obed blocks (A scores BLOCK)
  { servingTeam: 'B', outcome: 'BLOCK_BY_A',
    scorerName: 'Obed Figuera', scorerSide: 'A', pointType: 'BLOCK' },
  // 2 — A serves ACE (A scores, Adam server)
  { servingTeam: 'A', outcome: 'ACE_BY_A',
    scorerName: 'Adam Dazi', scorerSide: 'A', pointType: 'ACE' },
  // 3 — B serves, A's Maria kills (A scores KILL)
  { servingTeam: 'B', outcome: 'KILL_BY_A',
    scorerName: 'Maria Cortes', scorerSide: 'A', pointType: 'KILL' },
  // 4 — A serves, B's Eliseo blocks (B scores BLOCK)
  { servingTeam: 'A', outcome: 'BLOCK_BY_B',
    scorerName: 'Eliseo Robles', scorerSide: 'B', pointType: 'BLOCK' },
  // 5 — B serves ACE (B scores, Thania server)
  { servingTeam: 'B', outcome: 'ACE_BY_B',
    scorerName: 'THANIA Gonzales', scorerSide: 'B', pointType: 'ACE' },
  // 6 — A serves, B spike attack error → Shirley dug → A scores
  { servingTeam: 'A', outcome: 'ATTACK_ERR_B',
    scorerName: 'Shirley Alfaro', scorerSide: 'A', pointType: 'ATTACK_ERR' },
  // 7 — B serves service error → Miguel dug → A scores
  { servingTeam: 'B', outcome: 'SERVICE_ERR_B',
    scorerName: 'Miguel Deudor', scorerSide: 'A', pointType: 'SERVICE_ERR' },
  // 8 — A serves service error → Ludmi gets credit → B scores
  { servingTeam: 'A', outcome: 'SERVICE_ERR_A',
    scorerName: 'Ludmi Liberattore', scorerSide: 'B', pointType: 'SERVICE_ERR' },
];

/** Look up a rally's full info by index (with catalog wrapping). */
export function getRallyInfo(index) {
  const entry = RALLY_CATALOG[index % RALLY_CATALOG.length];
  const waypoints = entry.servingTeam === 'A'
    ? buildAWaypoints(entry.outcome)
    : buildBWaypoints(entry.outcome);
  return { ...entry, waypoints };
}
