import { useState, useCallback, useEffect } from 'react';
import './App.css';
import Background from './components/Background';
import StartScreen from './components/StartScreen';
import Header from './components/Header';
import Panel from './components/Panel';
import ItemCard from './components/ItemCard';
import Scoreboard from './components/Scoreboard';
import ScoreToast from './components/ScoreToast';
import Footer from './components/Footer';
import { TEAM_A, TEAM_B } from './data/players';
import { REASONS, BENEFITS, ICONS } from './data/panels';
import useRally from './hooks/useRally';

const TEAM_A_NAMES = TEAM_A.map((p) => ({ name: p.name, position: p.position }));
const TEAM_B_NAMES = TEAM_B.map((p) => ({ name: p.name, position: p.position }));

const ICON_SIZE = 26;
const renderIcon = (name) => {
  const Cmp = name ? ICONS[name] : null;
  return Cmp ? <Cmp size={ICON_SIZE} /> : null;
};

export default function App() {
  // 'start' shows only the arena + START MATCH button.
  // 'match' shows the full presentation UI.
  const [phase, setPhase] = useState('start');
  const startMatch = useCallback(() => setPhase('match'), []);

  // Reduced motion preference (also honored by Background)
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Continuous rally (ball + score + log). Paused before START MATCH.
  const { ball, impact, scoreA, scoreB, setNumber, log, servingTeam, playerFrames } = useRally({
    active: phase === 'match',
    reducedMotion,
  });

  // Body class controls the transition (fade-in / slide-in of UI panels).
  return (
    <div className={`app-root app-root--${phase}`}>
      <Background
        showPlayers
        showLabels={phase === 'match'}
        ball={ball}
        impact={impact}
        playerFrames={playerFrames}
        reducedMotion={reducedMotion}
      />

      <main className="stage" aria-hidden={phase === 'start'}>
        <Header />

        <div className="panels">
          <Panel title="REASONS">
            {REASONS.map((r, i) => (
              <ItemCard
                key={r.title}
                index={`0${i + 1}`}
                title={r.title}
                body={r.body}
                icon={renderIcon(r.icon)}
              />
            ))}
          </Panel>

          <div className="panels__scoreboard-wrap">
            <Scoreboard
              teamA={TEAM_A_NAMES}
              teamB={TEAM_B_NAMES}
              scoreA={scoreA}
              scoreB={scoreB}
              set={String(setNumber).padStart(2, '0')}
              servingTeam={servingTeam}
              log={log}
            />
          </div>

          <Panel title="BENEFITS" tag="LV. 02">
            {BENEFITS.map((r, i) => (
              <ItemCard
                key={r.title}
                index={`0${i + 1}`}
                title={r.title}
                body={r.body}
                icon={renderIcon(r.icon)}
              />
            ))}
          </Panel>
        </div>

        <Footer />

        <ScoreToast log={log} />
      </main>

      {phase === 'start' && <StartScreen onStart={startMatch} />}
    </div>
  );
}
