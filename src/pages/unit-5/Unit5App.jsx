import { useEffect, useState } from 'react';
import { PARTS } from './data/parts';
import ThreeIntro from './components/ThreeIntro';
import MatrixGlyph from './components/MatrixGlyph';
import HorrorEffects from './components/HorrorEffects';
import AnnotatedStage from './components/AnnotatedStage';
import './styles/mausoleum.css';

export default function Unit5App() {
  const [index, setIndex] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const part = PARTS[index];
  const isFirst = index === 0;
  const isLast = index === PARTS.length - 1;
  const isMystery = part.id === 'mystery';
  const isThanks = part.id === 'reflection';
  const [frightened, setFrightened] = useState(false);
  const [closing, setClosing] = useState(null); // null | 'active' | 'glitch' | 'off'

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(PARTS.length - 1, i + 1));

  // Reset any in-flight closing state when leaving Part 5.
  useEffect(() => {
    if (!isThanks) setClosing(null);
  }, [isThanks]);

  // Part 5 closing sequence:
  //   0.0s   text on stage
  //   3.4s   letters diverge outward (handled inside ThanksScreen)
  //   4.4s   blackout (root → black, all UI fades)
  //   4.5s   analog glitch overlay fires
  //   6.7s   glitch clears, screen stays black forever
  useEffect(() => {
    if (!isThanks) return;
    const t1 = setTimeout(() => setClosing('active'), 4400);
    const t2 = setTimeout(() => setClosing('glitch'), 4500);
    const t3 = setTimeout(() => setClosing('off'),    6700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isThanks]);

  // Smoothly fade the cinematic intro out before the unit body
  // mounts. Avoids a hard visual cut between globe and the terminal.
  const handleEnter = () => {
    setIntroFading(true);
    setTimeout(() => setIntroDone(true), 700);
  };

  // Listen for the frame-slide effect and toggle the scene-frame class.
  useEffect(() => {
    if (!isMystery) return;
    const handler = (e) => {
      if (e.detail === 'frameSlide') {
        setFrightened(true);
        setTimeout(() => setFrightened(false), 2500);
      }
    };
    window.addEventListener('unit5:horror', handler);
    return () => window.removeEventListener('unit5:horror', handler);
  }, [isMystery]);

  // Keyboard navigation (left/right arrows).
  useEffect(() => {
    const onKey = (e) => {
      if (!introDone) return;
      if (e.key === 'ArrowLeft' && !isFirst) goPrev();
      else if (e.key === 'ArrowRight' && !isLast) goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [introDone, isFirst, isLast]);

  return (
    <>
      {!introDone && (
        <div className={introFading ? 'unit5-intro-wrap is-fading' : 'unit5-intro-wrap'}>
          <ThreeIntro onEnter={handleEnter} />
        </div>
      )}
      <div
        className={
          `unit5-root ${frightened ? 'is-frightening' : ''} ${introDone ? 'is-revealed' : 'is-hidden'} ` +
          (closing === 'active' || closing === 'glitch' || closing === 'off' ? 'is-thanks-active ' : '') +
          (closing === 'glitch' ? 'is-thanks-glitch ' : '') +
          (closing === 'off' ? 'is-thanks-glitch-off' : '')
        }
      >
      <div className="unit5-crt" aria-hidden="true" />
      <div className="unit5-crt--glow" aria-hidden="true" />

      <HorrorEffects active={isMystery} />

      <header className="unit5-head">
        <MatrixGlyph />
        <h1 className="unit5-title">MAUSOLEUM OF QIN SHI HUANG</h1>
      </header>

      {/* The annotated investigation terminal. ALL slide content
          — title, caption, tagline, and details — lives in the
          connected panels above. The big info card below the image
          has been removed; the header panel at the bottom of the
          stage replaces it. */}
      <AnnotatedStage part={part} />

      <nav className="unit5-nav" aria-label="Part navigation">
        <button
          type="button"
          className="unit5-nav-btn"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous part"
        >
          ◂ PREV
        </button>

        <div className="unit5-dots" role="tablist">
          {PARTS.map((p, i) => p.hiddenInNav ? null : (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${p.title}`}
              className={`unit5-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
            >
              <span className="unit5-dot-num">{p.code}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="unit5-nav-btn"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next part"
        >
          NEXT ▸
        </button>
      </nav>

      <footer className="unit5-foot" />

      {/* Analog glitch overlay for the Part 5 closing sequence. */}
      <div className="unit5-thanks-glitch" aria-hidden="true" />
      </div>
    </>
  );
}
