import { useEffect, useRef, useState, useCallback } from 'react';
import './GateScreen.css';

const APP_KEY = import.meta.env.VITE_APP_KEY || '';

/**
 * Pre-app access screen.
 *
 * The user must type the access password (VITE_APP_KEY from .env) before
 * the main menu renders. A successful unlock is remembered for the rest of
 * the browser session via sessionStorage, so refreshing the page keeps the
 * user in. Closing the tab re-locks it.
 *
 * Visual: dark terminal / CRT — fits the rest of the app's aesthetic.
 */
export default function GateScreen({ onUnlock }) {
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const inputRef = useRef(null);
  const cursorRef = useRef(null);

  // Auto-focus the input as soon as the gate appears.
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  // Blinking caret on the placeholder.
  useEffect(() => {
    if (!cursorRef.current) return;
    let frame = 0;
    let raf;
    const tick = () => {
      frame++;
      cursorRef.current.style.opacity = frame % 60 < 30 ? '1' : '0';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Subtle random CRT glitch every few seconds.
  useEffect(() => {
    let timer;
    const loop = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 110);
      timer = setTimeout(loop, 4000 + Math.random() * 3000);
    };
    timer = setTimeout(loop, 2200);
    return () => clearTimeout(timer);
  }, []);

  const submit = useCallback(() => {
    if (reveal) return null;
    const ok = value.trim() === APP_KEY;
    if (ok) {
      setReveal(true);
      // Hand control back to <App /> after the wipe animation finishes.
      setTimeout(() => {
        try {
          sessionStorage.setItem('tesl1315:unlocked', '1');
        } catch (_) {
          /* sessionStorage may be unavailable in private mode — ignore */
        }
        onUnlock?.();
      }, 950);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 420);
    }
    return null;
  }, [value, reveal, onUnlock]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={`gate ${reveal ? 'is-revealing' : ''} ${glitch ? 'is-glitching' : ''}`}>
      {/* Decorative scanlines + vignette */}
      <div className="gate__scanlines" aria-hidden="true" />
      <div className="gate__vignette" aria-hidden="true" />

      {/* Boot / header banner */}
      <header className="gate__head">
        <div className="gate__brand">
          <span className="gate__brand-mark">◤◢</span>
          <span className="gate__brand-text">TESL 1315</span>
        </div>
        <div className="gate__status">
          <span className="gate__status-dot" />
          <span>SECURE TERMINAL · v0.5</span>
        </div>
      </header>

      {/* Main prompt */}
      <main className="gate__panel">
        <p className="gate__kicker">// RESTRICTED FILE — AUTHENTICATION REQUIRED //</p>
        <h1 className="gate__title">ENTER&nbsp;ACCESS&nbsp;CODE</h1>

        <div className={`gate__input-wrap ${shake ? 'is-shake' : ''}`}>
          <span className="gate__prompt">&gt;</span>
          <input
            ref={inputRef}
            type="password"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            className="gate__input"
            value={value}
            placeholder="••••••••"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Access code"
            disabled={reveal}
          />
          <span ref={cursorRef} className="gate__caret" aria-hidden="true" />
        </div>

        <button
          type="button"
          className="gate__submit"
          onClick={submit}
          disabled={reveal || value.length === 0}
        >
          UNLOCK&nbsp;<span>▸</span>
        </button>

        <p className={`gate__error ${shake ? 'is-shown' : ''}`} aria-live="polite">
          // ACCESS DENIED — INVALID CODE //
        </p>
      </main>

      {/* Reveal wipe — black sheet sweeps down before app mounts */}
      <div className="gate__wipe" aria-hidden="true">
        <div className="gate__wipe-scan" />
      </div>
    </div>
  );
}