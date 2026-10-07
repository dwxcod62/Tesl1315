import { useEffect, useState } from 'react';
import { PARTS } from './data/parts';
import PartIcon from './components/PartIcon';
import Scene from './components/Scene';
import MatrixGlyph from './components/MatrixGlyph';
import HorrorEffects from './components/HorrorEffects';
import Intro from './components/Intro';
import './styles/mausoleum.css';

export default function Unit5App() {
  const [index, setIndex] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const part = PARTS[index];
  const isFirst = index === 0;
  const isLast = index === PARTS.length - 1;
  const isMystery = part.id === 'mystery';
  const [frightened, setFrightened] = useState(false);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(PARTS.length - 1, i + 1));

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

  return (
    <>
      {!introDone && <Intro onEnter={() => setIntroDone(true)} />}
      <div
        className={`unit5-root ${frightened ? 'is-frightening' : ''} ${introDone ? 'is-revealed' : 'is-hidden'}`}
      >
      <div className="unit5-crt" aria-hidden="true" />
      <div className="unit5-crt--glow" aria-hidden="true" />

      <HorrorEffects active={isMystery} />

      <header className="unit5-head">
        <MatrixGlyph />
        <h1 className="unit5-title">MAUSOLEUM OF QIN SHI HUANG</h1>
      </header>

      <div className="unit5-stage-wrap">
        <span className="unit5-stage-stamp">{part.stamp || 'SEALED · 221 BCE'}</span>

        <div className={`unit5-scene-frame ${frightened ? 'is-frightened' : ''}`}>
          <span className="unit5-corner unit5-corner--tl" />
          <span className="unit5-corner unit5-corner--tr" />
          <span className="unit5-corner unit5-corner--bl" />
          <span className="unit5-corner unit5-corner--br" />
          <div className="unit5-scene" key={part.id}>
            <Scene kind={part.scene} />
          </div>
          <div className="unit5-scene-tag">
            // FIG.{part.code} · {part.title}
          </div>
        </div>
      </div>

      <section className="unit5-info" key={`info-${part.id}`}>
        <div className="unit5-info-head">
          <PartIcon kind={part.icon} size={42} />
          <div>
            <div className="unit5-info-code">FILE / {part.code} / 05</div>
            <h2 className="unit5-info-title">{part.title}</h2>
            <div className="unit5-info-caption">{part.caption}</div>
          </div>
        </div>

        <p className="unit5-info-line1">{part.line1}</p>
        <p className="unit5-info-line2">{part.line2}</p>
      </section>

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
          {PARTS.map((p, i) => (
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

      <footer className="unit5-foot">
        </footer>
    </div>
    </>
  );
}