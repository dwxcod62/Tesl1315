import { useEffect, useRef, useState, useCallback } from 'react';
import TvStatic from './TvStatic';

/**
 * Periodic horror glitches that fire only when on the "UNOPENED TOMB" tab.
 * Six effects — every 5s a different one is picked (no repeats).
 *   1. Static noise burst over the whole screen
 *   2. Crimson "thing" streaks across (red flash)
 *   3. Blackout then fade-in
 *   4. Dust / ash particles falling from the top
 *   5. Scene frame slowly slides right → snaps back to centre
 *   6. Eyes/sigil flicker in two corners
 */

const EFFECTS = ['noise', 'streak', 'blackout', 'ash', 'frameSlide', 'eyes', 'scramble'];

export default function HorrorEffects({ active }) {
  const [effect, setEffect] = useState(null);     // current running effect
  const [effectKey, setEffectKey] = useState(0);  // remount key per trigger
  const usedRef = useRef([]);                     // shuffle bag — every effect used before repeat
  const noiseCanvasRef = useRef(null);
  const ashCanvasRef = useRef(null);
  const scrambleCanvasRef = useRef(null);
  const scrambleRunRef = useRef(0);              // increments per scramble run
  const timerRef = useRef(null);

  // ----- NOISE canvas (redrawn on demand when effect=noise) -----
  useEffect(() => {
    const cvs = noiseCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const draw = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
      const id = ctx.createImageData(cvs.width, cvs.height);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = 255;     // red-tinted static (warm horror)
        d[i + 1] = v * 0.55;
        d[i + 2] = v * 0.25;
        d[i + 3] = 180;
      }
      ctx.putImageData(id, 0, 0);
    };
    draw();
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ----- ASH particles (drawn continuously, falls from top) -----
  useEffect(() => {
    const cvs = ashCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');

    let raf = 0;
    let particles = [];
    const init = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
      particles = Array.from({ length: 110 }, () => ({
        x: Math.random() * cvs.width,
        y: Math.random() * -cvs.height,
        r: 0.6 + Math.random() * 2.4,
        vy: 0.4 + Math.random() * 1.3,
        vx: -0.3 + Math.random() * 0.6,
        a: 0.25 + Math.random() * 0.55,
      }));
    };
    init();

    const loop = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx + Math.sin((p.y + p.x) * 0.012) * 0.3;
        if (p.y > cvs.height + 8) {
          p.y = -8;
          p.x = Math.random() * cvs.width;
        }
        ctx.fillStyle = `rgba(200, 170, 110, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => init();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ----- SCRAMBLE: read live text blocks, overlay scrambled glyphs -----
  // The canvas stays mounted while active; runs imperatively when triggered.
  const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}—=+*^?#________01';
  const runScramble = useCallback(() => {
    const cvs = scrambleCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    const root = document.querySelector('.unit5-root');
    if (!root) return;

    const selectorList = [
      '.unit5-title', '.unit5-host', '.unit5-stage-stamp',
      '.unit5-scene-tag', '.unit5-info-code', '.unit5-info-title',
      '.unit5-info-caption', '.unit5-info-line1', '.unit5-info-line2',
      '.unit5-matrix-label', '.unit5-dot-num', '.unit5-foot',
      '.unit5-nav-btn',
    ];
    const blocks = [];
    selectorList.forEach((sel) => {
      root.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;
        const cs = getComputedStyle(el);
        blocks.push({
          x: r.left, y: r.top, w: r.width, h: r.height,
          font: cs.fontFamily,
          size: parseFloat(cs.fontSize) || 14,
          weight: cs.fontWeight,
          color: cs.color,
          letterSpacing: parseFloat(cs.letterSpacing) || 0,
          textTransform: cs.textTransform,
          textAlign: cs.textAlign,
          original: el.textContent || '',
        });
      });
    });

    const start = performance.now();
    const totalMs = 800;
    const scrambleGlyph = () => '!<>-_\\/[]{}—=+*^?#01'[((Math.random() * 22) | 0)];
    const idx = blocks.map((b) => b.original.split(''));

    let raf = 0;
    const draw = (t) => {
      const elapsed = t - start;
      const progress = Math.min(1, elapsed / totalMs);
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      blocks.forEach((b, bi) => {
        const w = b.weight === 'bold' || +b.weight >= 600 ? '600' : '400';
        ctx.font = `${w} ${b.size}px ${b.font}`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = b.color;
        const chars = idx[bi];
        const len = chars.length;
        const baseY = b.y + b.size;
        let cursorX = b.x;
        if (b.textAlign === 'center') {
          cursorX = b.x + (b.w - len * (b.size * 0.6 + b.letterSpacing)) / 2;
        }

        const out = chars.map((ch) => {
          if (ch.trim() === '') return ch;
          // Reveal original gradually left → right
          if (progress * len * 1.4 - chars.indexOf(ch) > 1.2) return ch;
          return scrambleGlyph();
        }).join('');

        for (const ch of out) {
          if (ch !== ' ') ctx.fillText(ch, cursorX, baseY);
          cursorX += ctx.measureText(ch).width + b.letterSpacing;
        }
      });

      // CRT jitter lines
      ctx.fillStyle = 'rgba(184, 30, 30, 0.06)';
      for (let i = 0; i < 6; i++) {
        const y = (Math.random() * cvs.height) | 0;
        ctx.fillRect(0, y, cvs.width, 1);
      }

      if (progress < 1) {
        raf = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ----- Pick a new effect every 5s, only when active -----
  const cycleIndexRef = useRef(0);

  const trigger = useCallback(() => {
    // Guarantee every effect appears once per cycle of EFFECTS.length picks.
    if (usedRef.current.length >= EFFECTS.length) {
      usedRef.current = [];
      cycleIndexRef.current = 0;
    }
    // Take the next effect in order at the start of a fresh cycle
    // (so all 7 effects show within ~35s deterministically), then random.
    let pick;
    if (cycleIndexRef.current < EFFECTS.length) {
      pick = EFFECTS[cycleIndexRef.current];
      cycleIndexRef.current++;
    } else {
      const remaining = EFFECTS.filter((e) => !usedRef.current.includes(e));
      pick = remaining[Math.floor(Math.random() * remaining.length)];
    }
    usedRef.current.push(pick);
    setEffect(pick);
    setEffectKey((k) => k + 1);
    if (pick === 'frameSlide') {
      window.dispatchEvent(new CustomEvent('unit5:horror', { detail: 'frameSlide' }));
    }
    if (pick === 'scramble') {
      // Defer to next frame so React mounts the <canvas> first (ref resolves).
      requestAnimationFrame(() => runScramble());
    }
  }, [runScramble]);

  useEffect(() => {
    if (!active) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setEffect(null);
      return;
    }
    // first trigger 1.2s after entering tab (give user time to read)
    const first = setTimeout(trigger, 1200);
    timerRef.current = setInterval(trigger, 5000);
    return () => {
      clearTimeout(first);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, trigger]);

  // ----- Eye/sigil shape (SVG) -----
  const Eye = ({ flip = false }) => (
    <svg viewBox="0 0 100 60" className={`unit5-eye ${flip ? 'is-flip' : ''}`}>
      <defs>
        <radialGradient id="eyeIris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4e0a8" />
          <stop offset="40%" stopColor="#b85a3a" />
          <stop offset="100%" stopColor="#1a0a06" />
        </radialGradient>
      </defs>
      <path d="M5 30 Q50 -8 95 30 Q50 68 5 30 Z" fill="none" stroke="#f4e0a8" strokeWidth="1.4" />
      <circle cx="50" cy="30" r="20" fill="url(#eyeIris)" />
      <ellipse cx="50" cy="30" rx="6" ry="18" fill="#0a0805" />
      <circle cx="50" cy="30" r="3" fill="#f4e0a8" />
    </svg>
  );

  return (
    <>
      {/* Continuous ash — fades in only when active */}
      <canvas
        ref={ashCanvasRef}
        className={`unit5-ash ${active ? 'is-active' : ''}`}
        aria-hidden="true"
      />

      {/* Per-trigger overlays */}
      {effect === 'noise' && (
        <canvas
          key={`noise-${effectKey}`}
          ref={noiseCanvasRef}
          className="unit5-noise"
          aria-hidden="true"
        />
      )}

      {effect === 'streak' && (
        <TvStatic key={`tvstatic-${effectKey}`} duration={900} />
      )}

      {effect === 'blackout' && (
        <div key={`blackout-${effectKey}`} className="unit5-blackout" aria-hidden="true">
          <div className="unit5-blackout__flash" />
        </div>
      )}

      {effect === 'eyes' && (
        <div key={`eyes-${effectKey}`} className="unit5-eyes" aria-hidden="true">
          <Eye />
          <Eye flip />
        </div>
      )}

      {/* Scramble — full-page overlay re-drawing live text as random glyphs.
          Canvas is mounted once when active; redraws imperatively per trigger. */}
      <canvas
        ref={scrambleCanvasRef}
        className="unit5-scramble"
        aria-hidden="true"
        style={{ display: active ? 'block' : 'none' }}
      />
    </>
  );
}