import { useEffect, useRef, useState } from 'react';

/**
 * Cinematic epic intro for File 05 / Mausoleum of Qin Shi Huang.
 *
 * Black screen · typewriter kicker · letter-by-letter hook · ENTER button.
 * Silent (no audio). On click / Enter / Space, the screen wipes up
 * (ramp) and signals `onEnter()` for the parent to fade the unit body
 * in. Honors `prefers-reduced-motion`.
 *
 * Visual sequence:
 *   0.0s   "incoming transmission" — kicker fades in
 *   0.8s   kicker caret starts blinking; hero title types in
 *   3.4s   hero title finished; sub-line fades in
 *   4.2s   ENTER button fades in (pulsing border)
 *   click  → ramp wipes down + dust sweep, 900ms
 *   done   → onEnter() → parent fades unit body
 */
export default function ThreeIntro({ onEnter }) {
  const [phase, setPhase] = useState('idle'); // idle | leaving | gone
  const [typed, setTyped] = useState('');     // live typewriter for hero
  const [showSub, setShowSub] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showKicker, setShowKicker] = useState(false);
  const heroRef = useRef(null);
  const lockRef = useRef(false);

  const HERO = 'WHAT LIES BENEATH THE FIRST EMPEROR';
  const KICKER = '// INCOMING TRANSMISSION  ·  XI\u2011AN  ·  221 BCE  ·  FILE_05 //';
  const SUB    = 'Beneath a mound near modern Xi\u2019an, an army of clay, eight thousand strong, waits in the dark.';

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Skip animations: show everything instantly.
      setShowKicker(true);
      setTyped(HERO);
      setShowSub(true);
      setShowCta(true);
      return;
    }

    const t1 = setTimeout(() => setShowKicker(true), 200);
    // Typewriter — 28ms per char ~ feels like a typewriter, not laggy.
    const total = HERO.length;
    const perChar = 32;
    const t2 = setTimeout(() => {
      let i = 0;
      const tick = () => {
        i += 1;
        setTyped(HERO.slice(0, i));
        if (i < total) timer = setTimeout(tick, perChar);
      };
      let timer = setTimeout(tick, perChar);
    }, 900);
    const t3 = setTimeout(() => setShowSub(true), 900 + total * perChar + 400);
    const t4 = setTimeout(() => setShowCta(true), 900 + total * perChar + 1200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const leave = () => {
    if (lockRef.current) return;
    lockRef.current = true;
    setPhase('leaving');
    // Ramp wipe = 900ms. Fire onEnter mid-wipe so the unit body
    // starts fading in just as the intro finishes.
    setTimeout(() => onEnter?.(), 700);
    setTimeout(() => setPhase('gone'), 1000);
  };

  // Keyboard: Enter / Space → enter (only while idle)
  useEffect(() => {
    const k = (e) => {
      if (phase !== 'idle') return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        leave();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`unit5-intro unit5-intro--cinematic ${phase === 'leaving' ? 'is-leaving' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Enter the mausoleum"
      onClick={leave}
    >
      {/* Film grain (pure CSS, very subtle) */}
      <div className="unit5-intro__grain" aria-hidden="true" />

      {/* Soft center vignette */}
      <div className="unit5-intro__vignette" aria-hidden="true" />

      {/* Top + bottom scanlines (CRT museum feel) */}
      <div className="unit5-intro__scan" aria-hidden="true" />

      {/* Kicker line + blinking caret */}
      <div className={`unit5-intro__kicker ${showKicker ? 'is-in' : ''}`}>
        <span>{KICKER}</span>
        <span className="unit5-intro__caret" aria-hidden="true">_</span>
      </div>

      {/* Hero title (typewriter) */}
      <h1 className="unit5-intro__title" ref={heroRef} aria-live="polite">
        <span className="unit5-intro__title-text">{typed || '\u00A0'}</span>
        <span className={`unit5-intro__title-caret ${showCta ? 'is-hide' : ''}`} aria-hidden="true">_</span>
      </h1>

      {/* Sub line (fades in once title completes) */}
      <p className={`unit5-intro__sub ${showSub ? 'is-in' : ''}`}>{SUB}</p>

      {/* ENTER button (fades in last) */}
      <div className={`unit5-intro__cta ${showCta ? 'is-in' : ''}`}>
        <span className="unit5-intro__cta-rule" aria-hidden="true" />
        <button
          type="button"
          className="unit5-intro__cta-btn"
          onClick={(e) => { e.stopPropagation(); leave(); }}
        >
          <span className="unit5-intro__cta-bracket">[</span>
          <span className="unit5-intro__cta-label">ENTER&nbsp;THE&nbsp;TOMB</span>
          <span className="unit5-intro__cta-bracket">]</span>
          <span className="unit5-intro__cta-arrow" aria-hidden="true">▾</span>
        </button>
        <span className="unit5-intro__cta-meta">CLICK &nbsp;/&nbsp; PRESS &nbsp;ENTER</span>
      </div>

      {/* Footer museum tag */}
      <div className="unit5-intro__foot">
        <span>UNIT&nbsp;05</span>
        <span className="unit5-intro__foot-dot" />
        <span>MAUSOLEUM OF QIN SHI HUANG</span>
        <span className="unit5-intro__foot-dot" />
        <span>SEALED · 221 BCE</span>
      </div>

      {/* Black ramp wipe (just a CSS clip-path) */}
      <div className={`unit5-intro__ramp ${phase === 'leaving' ? 'is-wiping' : ''}`} aria-hidden="true">
        <div className="unit5-intro__ramp-scan" />
      </div>
    </div>
  );
}
