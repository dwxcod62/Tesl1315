import { useEffect, useState } from 'react';

/**
 * Tomb entrance / start screen.
 * Renders a stylised tumulus mound with a sealed doorway.
 * On click: plays a "ramp" animation — doorway opens, fog pours in,
 * scene fades — then signals parent via onEnter() to swap in the main UI.
 */
export default function Intro({ onEnter }) {
  const [phase, setPhase] = useState('idle'); // idle | opening | gone
  const [hinted, setHinted] = useState(false);

  // Pulse the hint text after a few seconds so the user knows to click.
  useEffect(() => {
    const t1 = setTimeout(() => setHinted(true), 1800);
    return () => clearTimeout(t1);
  }, []);

  const handleEnter = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    // Wait until the ramp has fully covered the screen before signalling
    // parent — main UI then fades in *after* the wipe, no jarring jump.
    // Ramp tear: 350ms delay + 1700ms anim ≈ 2050ms → call at 2100ms.
    setTimeout(() => {
      if (onEnter) onEnter();
    }, 2100);
    // Keep intro mounted a hair longer so the ramp's fiery top edge stays
    // visible while the main page reveals underneath.
    setTimeout(() => setPhase('gone'), 2700);
  };

  // Keyboard: Enter / Space also opens the tomb
  useEffect(() => {
    const k = (e) => {
      if (phase === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`unit5-intro ${phase === 'opening' ? 'is-opening' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Enter the mausoleum"
      onClick={handleEnter}
    >
      {/* Background mist layers */}
      <div className="unit5-intro__mist unit5-intro__mist--a" aria-hidden="true" />
      <div className="unit5-intro__mist unit5-intro__mist--b" aria-hidden="true" />
      <div className="unit5-intro__vignette" aria-hidden="true" />

      {/* Distant ground line */}
      <div className="unit5-intro__horizon" aria-hidden="true" />

      {/* Tomb */}
      <div className="unit5-intro__tomb" aria-hidden="true">
        <div className="unit5-intro__mound" />
        <div className="unit5-intro__mound-shadow" />

        {/* The sealed doorway carved into the mound */}
        <div className="unit5-intro__doorway">
          <div className="unit5-intro__doorlight" />
          <div className="unit5-intro__doorframe">
            {/* Twin stone door halves, split when opening */}
            <div className="unit5-intro__door unit5-intro__door--l">
              <span className="unit5-intro__rivet" />
              <span className="unit5-intro__rivet" />
              <span className="unit5-intro__rivet" />
            </div>
            <div className="unit5-intro__door unit5-intro__door--r">
              <span className="unit5-intro__rivet" />
              <span className="unit5-intro__rivet" />
              <span className="unit5-intro__rivet" />
            </div>
          </div>
          {/* Glyphs around the door */}
          <span className="unit5-intro__glyph unit5-intro__glyph--l">秦</span>
          <span className="unit5-intro__glyph unit5-intro__glyph--r">始</span>
        </div>

        {/* Volumetric beam of warm light pouring from the opened door */}
        <div className="unit5-intro__beam" aria-hidden="true" />

        {/* Dust shaken loose from the seal */}
        <div className="unit5-intro__dust" aria-hidden="true">
          <span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span />
        </div>
      </div>

      {/* Foreground text */}
      <div className="unit5-intro__copy">
        <p className="unit5-intro__kicker">// FILE 05 · SEALED SINCE THE FIRST EMPEROR //</p>
        <h1 className="unit5-intro__title">MAUSOLEUM<br/><em>OF&nbsp;QIN SHI HUANG</em></h1>
      </div>

      {/* Click hint */}
      <div className={`unit5-intro__hint ${hinted ? 'is-hinted' : ''}`}>
        <span className="unit5-intro__hint-pulse" />
        <span className="unit5-intro__hint-text">CLICK&nbsp;THE&nbsp;TOMB&nbsp;TO&nbsp;ENTER&nbsp;&nbsp;▾</span>
      </div>

      {/* Opening transition: black ramp + scanlines wipe down */}
      <div className="unit5-intro__ramp" aria-hidden="true">
        <div className="unit5-intro__ramp-scan" />
      </div>
    </div>
  );
}