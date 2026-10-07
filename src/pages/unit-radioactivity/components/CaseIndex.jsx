import { useState, useCallback, useEffect, useRef } from 'react';
import { ITEMS, BANANA, POTASSIUM, LETHAL, DOE } from '../data/dossier';

// Map inline tokens → term data + highlight variant.
// Adding more cross-references later is just one entry here.
const TERMS = {
  term: { data: BANANA, variant: 'yellow' },
  natural: { data: POTASSIUM, variant: 'green' },
  lethal: { data: LETHAL, variant: 'toxic' },
  source: { data: DOE, variant: 'gov' },
};

/**
 * Render a string that may contain [[term]]...[[/term]],
 * [[natural]]...[[/natural]] and [[lethal]]...[[/lethal]]
 * highlights. Each highlight opens the dossier popover for that term.
 */
function RichText({ text, onTermClick }) {
  if (!text) return null;
  // Split on any of our tokens.
  const pattern = /(\[\[(?:term|natural|lethal|source)\]\][\s\S]*?\[\[\/(?:term|natural|lethal|source)\]\])/g;
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[(term|natural|lethal|source)\]\]([\s\S]*)\[\[\/\1\]\]$/);
        if (m) {
          const [, key, word] = m;
          const entry = TERMS[key];
          return (
            <span
              key={i}
              role="button"
              tabIndex={0}
              className={`dossier__term dossier__term--${entry.variant}`}
              onClick={() => onTermClick(entry.data)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTermClick(entry.data);
                }
              }}
              title={`Open details for ${word}`}
            >
              {word}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/**
 * Animated banana counter: ticks from `start` → `end` over `duration` ms
 * on mount, then settles.
 */
function BananaCounter({ counter }) {
  const [value, setValue] = useState(counter.start);
  const rafRef = useRef(0);
  useEffect(() => {
    let startTs = 0;
    const tick = (ts) => {
      if (!startTs) startTs = ts;
      const t = Math.min(1, (ts - startTs) / counter.duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(counter.start + (counter.end - counter.start) * eased);
      setValue(v);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [counter.start, counter.end, counter.duration]);
  return (
    <div className="dossier__lethal-counter" aria-live="polite">
      <span className="dossier__lethal-num">{value.toLocaleString()}</span>
      <span className="dossier__lethal-suffix">{counter.suffix}</span>
      <span className="dossier__lethal-cap"> {counter.caption}</span>
    </div>
  );
}

/**
 * One popover card. The parent stacks multiple cards side-by-side.
 */
function TermCard({ term, offset, onClose, onTermClick }) {
  const palette = term.palette || 'default';
  return (
    <article
      className={`dossier__term-box dossier__term-box--${palette}`}
      onClick={(e) => e.stopPropagation()}
      style={{ '--card-offset': `${offset}px` }}
    >
      <div className="dossier__term-stamp" aria-hidden="true">
        <span>FILE</span>
        <span>{term.id.toUpperCase()}</span>
      </div>
      <button
        type="button"
        className="dossier__term-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <header className="dossier__term-head">
        <span className="dossier__term-kicker">TERM OF INTEREST</span>
        <h3 className="dossier__term-title">{term.term}</h3>
        <p className="dossier__term-tagline">{term.tagline}</p>
      </header>
      {term.id === 'banana' && (
        <figure className="dossier__term-fig">
          <img
            src="https://i.pinimg.com/736x/bc/96/2d/bc962d7353cda5e6aea5b98aa207f536.jpg"
            alt="Banana"
            className="dossier__term-img"
            loading="lazy"
          />
          <figcaption>Banana · Musa spp.</figcaption>
        </figure>
      )}
      {term.id === 'potassium' && (
        <figure className="dossier__term-fig dossier__term-fig--no-photo">
          <div className="dossier__term-sigil" aria-hidden="true">K</div>
          <figcaption>Potassium · K · Z = 19</figcaption>
        </figure>
      )}
      {term.id === 'lethal' && term.counter && (
        <BananaCounter counter={term.counter} />
      )}
      {term.id === 'doe' && (
        <figure className="dossier__term-fig dossier__term-fig--no-photo">
          <img
            src="https://www.energy.gov/themes/custom/energy_gov/img/logo-image.png"
            alt="U.S. Department of Energy logo"
            className="dossier__term-logo"
            loading="lazy"
          />
          <figcaption>U.S. Department of Energy</figcaption>
        </figure>
      )}
      <div className="dossier__term-sheet">
        {term.facts.map((f, i) => (
          <div key={i} className="dossier__term-row">
            <dt className="dossier__term-label">{f.label}</dt>
            <dd className="dossier__term-value">{f.value}</dd>
            {f.note && (
              <span className="dossier__term-note">
                <RichText text={f.note} onTermClick={onTermClick} />
              </span>
            )}
          </div>
        ))}
      </div>
      <footer className="dossier__term-foot">
        <span>Source: {term.source}</span>
        <button
          type="button"
          className="dossier__term-cta"
          onClick={onClose}
        >
          BACK TO FILE
        </button>
      </footer>
    </article>
  );
}

/**
 * Stacked popovers. Each click appends a card; closing the topmost
 * card pops one off the stack.
 */
function TermPopovers({ terms, open, closeTop, closeAll }) {
  // Lock scroll + Escape handler.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeTop();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [closeTop]);

  return (
    <div
      className="dossier__term-backdrop"
      onClick={closeAll}
      role="dialog"
      aria-modal="true"
      aria-label="Term details"
    >
      <div className="dossier__term-stack" onClick={(e) => e.stopPropagation()}>
        {terms.map((t, i) => (
          <TermCard
            key={`${t.id}-${i}`}
            term={t}
            offset={i * 36}
            onClose={closeTop}
            onTermClick={open}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Five-item list rendered as a numbered case-file index.
 * Owns the popover stack state.
 */
export default function CaseIndex() {
  const [stack, setStack] = useState([]);

  const open = useCallback((term) => {
    setStack((s) => {
      // If this exact term is already topmost, do nothing.
      if (s.length && s[s.length - 1].id === term.id) return s;
      return [...s, term];
    });
  }, []);
  const closeTop = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const closeAll = useCallback(() => setStack([]), []);

  // BodyText (inline within the case list) keeps its old name for diffs.
  const BodyText = useCallback(
    ({ text }) => <RichText text={text} onTermClick={open} />,
    [open]
  );

  return (
    <>
      <div className="dossier__case-source">
        <button
          type="button"
          className="dossier__gov-badge"
          onClick={() => open(DOE)}
          aria-label="Open U.S. Department of Energy source card"
          title="Official U.S. government source — .gov verified"
        >
          <span className="dossier__gov-badge-flag" aria-hidden="true">
            <span className="dossier__gov-badge-stars">★★★</span>
            <span className="dossier__gov-badge-stripes" />
          </span>
          <span className="dossier__gov-badge-body">
            <img
              src="https://www.energy.gov/themes/custom/energy_gov/img/logo-image.png"
              alt=""
              className="dossier__gov-badge-logo"
              loading="lazy"
            />
            <span className="dossier__gov-badge-meta">
              <span className="dossier__gov-badge-title">U.S. Department of Energy</span>
              <span className="dossier__gov-badge-url">
                <strong>.gov</strong> · energy.gov · 5★ trusted source
              </span>
            </span>
          </span>
          <span className="dossier__gov-badge-verified" aria-hidden="true">VERIFIED</span>
        </button>
        <p className="dossier__case-source-note">
          Statistics and figures in this dossier are sourced from official U.S. government
          publications — click the badge to verify the source.
        </p>
      </div>
      <ol className="dossier__cases">
        {ITEMS.map((it) => (
          <li key={it.no} className="dossier__case">
            <div className="dossier__case-side">
              <span className="dossier__case-no">{it.no}</span>
              <span className="dossier__case-stamp" aria-hidden="true">
                {it.stamp || 'FILED'}
              </span>
            </div>
            <div className="dossier__case-main">
              <div className="dossier__case-head">
                <h3 className="dossier__case-title">{it.title}</h3>
                <span className="dossier__case-isotope" title="Isotope">
                  <span className="dossier__case-isotope-dot" aria-hidden="true" />
                  {it.isotope}
                </span>
              </div>
              <p className="dossier__case-kicker">
                <BodyText text={it.kicker} />
              </p>
              {it.body.map((p, i) => (
                <p key={i} className="dossier__case-body">
                  <BodyText text={p} />
                </p>
              ))}
              {it.fact && (
                <aside className="dossier__case-fact">
                  <span className="dossier__case-fact-tag">FUN FACT</span>
                  <span>
                    <BodyText text={it.fact} />
                  </span>
                </aside>
              )}
            </div>
          </li>
        ))}
      </ol>
      {stack.length > 0 && (
        <TermPopovers
          terms={stack}
          open={open}
          closeTop={closeTop}
          closeAll={closeAll}
        />
      )}
    </>
  );
}
