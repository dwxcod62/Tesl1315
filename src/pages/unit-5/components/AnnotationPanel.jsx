import { forwardRef } from 'react';

/**
 * AnnotationPanel
 * ---------------
 * Five distinct visual variants, all on the same dark-gold palette.
 * The variant is chosen per-annotation in `parts.js` based on the
 * content (data, claim, or compactness).
 *
 *   archival  : default — full info card with title + body + ref.
 *   technical : measurement / numeric — leading ref badge, monospace.
 *   evidence  : claim that needs caveat (UNVERIFIED) — red corner.
 *   compact   : one-liner only — small slab, minimal chrome.
 *   header    : the slide title + caption + tagline — big serif
 *               block, sits at the bottom-centre, replaces the old
 *               info card. Has a connector but no marker.
 */
const AnnotationPanel = forwardRef(function AnnotationPanel(
  { annotation, index, active, dimmed, onHover, onClick, side, part },
  ref,
) {
  const variant = annotation.variant || 'archival';
  const dataAttrs = {
    'data-id': annotation.id,
    'data-side': annotation.side || side,
    'data-variant': variant,
  };

  return (
    <article
      ref={ref}
      className={`unit5-anno-panel unit5-anno-panel--${side} unit5-anno-panel--${variant} ${active ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      {...dataAttrs}
    >
      {variant === 'archival' && <ArchivalPanel annotation={annotation} index={index} active={active} onClick={onClick} />}
      {variant === 'technical' && <TechnicalPanel annotation={annotation} index={index} active={active} onClick={onClick} />}
      {variant === 'evidence' && <EvidencePanel annotation={annotation} index={index} active={active} onClick={onClick} />}
      {variant === 'compact'  && <CompactPanel  annotation={annotation} index={index} active={active} onClick={onClick} />}
      {variant === 'header'   && <HeaderPanel   annotation={annotation} part={part} />}
    </article>
  );
});

// ── header — slide title + caption + tagline, large serif block ──
function HeaderPanel({ annotation, part }) {
  return (
    <div className="unit5-anno-panel__header">
      <span className="unit5-anno-panel__header-code" aria-hidden="true">
        // FIG.{part.code}
      </span>
      <h2 className="unit5-anno-panel__header-title">{part.title}</h2>
      <span className="unit5-anno-panel__header-caption">{part.caption}</span>
      <div className="unit5-anno-panel__header-line" aria-hidden="true" />
      <p className="unit5-anno-panel__header-line1">{part.line1}</p>
      <p className="unit5-anno-panel__header-line2">{part.line2}</p>
    </div>
  );
}

function PinButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      className="unit5-anno-panel__pin"
      onClick={onClick}
      aria-label={active ? 'Unpin' : 'Pin this annotation'}
    >
      {active ? '◆ PINNED' : '◇ PIN'}
    </button>
  );
}

// ── archival — full dossier card with file-tab fold ────────────────
function ArchivalPanel({ annotation, index, active, onClick }) {
  return (
    <>
      <span className="unit5-anno-panel__tab" aria-hidden="true" />
      <span className="unit5-anno-panel__notch" aria-hidden="true" />
      <header className="unit5-anno-panel__head">
        <span className="unit5-anno-panel__num">
          {String(index).padStart(2, '0')}
        </span>
        <span className="unit5-anno-panel__ref">{annotation.ref}</span>
      </header>
      <h3 className="unit5-anno-panel__title">{annotation.title}</h3>
      <div className="unit5-anno-panel__body">
        {annotation.text.map((line, i) => <p key={i}>{line}</p>)}
      </div>
      <footer className="unit5-anno-panel__foot">
        <PinButton active={active} onClick={onClick} />
      </footer>
    </>
  );
}

// ── technical — measurement slab, monospace, ruled grid ──────────
function TechnicalPanel({ annotation, index, active, onClick }) {
  return (
    <>
      <header className="unit5-anno-panel__head unit5-anno-panel__head--mono">
        <span className="unit5-anno-panel__ref">{annotation.ref}</span>
        <span className="unit5-anno-panel__num">
          {String(index).padStart(2, '0')}
        </span>
      </header>
      <h3 className="unit5-anno-panel__title unit5-anno-panel__title--mono">
        {annotation.title}
      </h3>
      <div className="unit5-anno-panel__ruler" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => <span key={i} />)}
      </div>
      <div className="unit5-anno-panel__body">
        {annotation.text.map((line, i) => <p key={i}>{line}</p>)}
      </div>
      <footer className="unit5-anno-panel__foot">
        <PinButton active={active} onClick={onClick} />
      </footer>
    </>
  );
}

// ── evidence — claim with red "UNVERIFIED" corner stamp ──────────
function EvidencePanel({ annotation, index, active, onClick }) {
  return (
    <>
      <span className="unit5-anno-panel__stamp" aria-hidden="true">
        UNVERIFIED
      </span>
      <header className="unit5-anno-panel__head">
        <span className="unit5-anno-panel__num">
          {String(index).padStart(2, '0')}
        </span>
        <span className="unit5-anno-panel__ref">{annotation.ref}</span>
      </header>
      <h3 className="unit5-anno-panel__title">{annotation.title}</h3>
      <div className="unit5-anno-panel__body">
        {annotation.text.map((line, i) => <p key={i}>{line}</p>)}
      </div>
      <div className="unit5-anno-panel__caution" aria-hidden="true">
        <span>·</span> historical record, not confirmed
      </div>
      <footer className="unit5-anno-panel__foot">
        <PinButton active={active} onClick={onClick} />
      </footer>
    </>
  );
}

// ── compact — one-liner slab, no title chrome ───────────────────
function CompactPanel({ annotation, index, active, onClick }) {
  return (
    <div className="unit5-anno-panel__compact">
      <span className="unit5-anno-panel__num unit5-anno-panel__num--inline">
        {String(index).padStart(2, '0')}
      </span>
      <div className="unit5-anno-panel__compact-body">
        <span className="unit5-anno-panel__ref">{annotation.ref}</span>
        <h3 className="unit5-anno-panel__title">{annotation.title}</h3>
        <div className="unit5-anno-panel__body">
          {annotation.text.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
      <button
        type="button"
        className="unit5-anno-panel__pin unit5-anno-panel__pin--inline"
        onClick={onClick}
        aria-label={active ? 'Unpin' : 'Pin this annotation'}
      >
        {active ? '◆' : '◇'}
      </button>
    </div>
  );
}

export default AnnotationPanel;
