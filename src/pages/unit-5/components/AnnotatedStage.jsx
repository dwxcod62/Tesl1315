// AnnotatedStage — the archaeological investigation terminal.
//
// Simplified layout: a single full-width info panel under the photo.
// All annotations from `part.annotations[]` are rendered as compact
// rows inside that one panel — no side rails, no markers, no SVG
// leader lines. The header card still carries the part title +
// caption + the two summary lines (line1, line2).

import { useLayoutEffect, useMemo, useRef } from 'react';
import ThanksScreen from './ThanksScreen';

/** Pick a visual variant for a summary row based on annotation kind. */
function rowVariantClass(variant) {
  switch (variant) {
    case 'archival':  return 'unit5-summary-row unit5-summary-row--archival';
    case 'technical': return 'unit5-summary-row unit5-summary-row--technical';
    case 'evidence':  return 'unit5-summary-row unit5-summary-row--evidence';
    case 'compact':   return 'unit5-summary-row unit5-summary-row--compact';
    default:          return 'unit5-summary-row';
  }
}

export default function AnnotatedStage({ part }) {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const panelRef = useRef(null);

  // Measure on mount + on resize, and set the frame's max-height
  // so the photo wraps to whatever space is left after the info
  // panel takes its natural height. Keeps the whole stage inside
  // the viewport (root has overflow:hidden + 100svh).
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const panel = panelRef.current;
    if (!stage || !frame || !panel) return;

    const fit = () => {
      const stageH = stage.clientHeight;
      const panelH = panel.offsetHeight;
      const cs = getComputedStyle(stage);
      const gap = parseFloat(cs.rowGap || cs.gap) || 12;
      const target = Math.max(120, stageH - panelH - gap - 4);
      frame.style.maxHeight = target + 'px';
    };
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    ro.observe(panel);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [part]);

  // All non-header annotations become a row in the summary list.
  const summaryRows = useMemo(() => {
    return (part.annotations || []).filter(
      (a) => a.variant !== 'header' && !a.isHeader
    );
  }, [part]);

  return (
    <section
      ref={stageRef}
      className={`unit5-stage ${part.hiddenInNav ? 'is-thanks' : ''}`}
      aria-label="Annotated investigation"
    >      {/* Photo (no markers, no SVG overlay) */}
      <div ref={frameRef} className="unit5-stage-frame">
        <div className="unit5-corner unit5-corner--tl" aria-hidden="true" />
        <div className="unit5-corner unit5-corner--tr" aria-hidden="true" />
        <div className="unit5-corner unit5-corner--bl" aria-hidden="true" />
        <div className="unit5-corner unit5-corner--br" aria-hidden="true" />
        <div className="unit5-stage-photo-wrap">
          <img
            className="unit5-stage-photo"
            src={part.image}
            alt={part.title || ''}
            draggable={false}
          />
          {part.stamp && <div className="unit5-stage-stamp">{part.stamp}</div>}
        </div>
      </div>

      {/* Thank-you closing — renders only when this part is flagged
          hiddenInNav. The image + info panel are hidden via CSS so
          the rest of the slide is replaced by the animated closing
          screen (text diverge → blackout → analog glitch). */}
      {part.hiddenInNav && <ThanksScreen />}

      {/* Single full-width info panel (the header variant) with all
          annotation rows stacked underneath the title block. */}
      <article
        ref={panelRef}
        id="unit5-panel-header"
        className="unit5-anno-panel unit5-anno-panel--header unit5-info-panel"
      >
        <div className="unit5-anno-panel__header-code">
          FIG.{String(part.code || '00').padStart(2, '0')}
        </div>
        <h2 className="unit5-anno-panel__header-title">
          {part.title || 'TITLE'}
        </h2>
        <div className="unit5-anno-panel__header-caption">
          {part.caption || ''}
        </div>
        <div className="unit5-anno-panel__header-line" />
        <p className="unit5-anno-panel__header-line1">{part.line1 || ''}</p>
        <p className="unit5-anno-panel__header-line2">{part.line2 || ''}</p>

        {summaryRows.length > 0 && (
          <ul className="unit5-info-panel__list" aria-label="Annotations">
            {summaryRows.map((a, i) => (
              <li key={a.id} className={rowVariantClass(a.variant)}>
                <span className="unit5-info-panel__num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="unit5-info-panel__body">
                  <h3 className="unit5-info-panel__title">{a.title}</h3>
                  <div className="unit5-info-panel__text">
                    {(a.text || []).map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
