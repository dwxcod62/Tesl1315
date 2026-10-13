// ThanksScreen — closing screen for Part 5.
//
// Timeline:
//   0.0s  "Thank you." + sub fade in (letter-spacing collapse + blur fade)
//   3.4s  Letters diverge outward to the 4 corners + sub fades out
//   4.4s  Screen fades to black
//   4.5s  Analog glitch fires for ~2.2s (RGB tear, scanline, shake)
//   6.7s  Glitch clears, screen stays black (terminal off)
//
// The component dispatches a custom event on the root so the parent
// can dim the rest of the page (headings, nav) in sync.

import { useEffect, useRef } from 'react';

const LETTERS = 'Thank you.'.split('');

// Diverge vectors: alternate TL / TR / BL / BR so the word
// scatters like ash from the center.
const VECTORS = [
  [-1, -1], [-1,  1], [ 1, -1], [ 1,  1],
  [-1, -1], [-1,  1], [ 1, -1], [ 1,  1],
  [-1, -1], [-1,  1],
];

export default function ThanksScreen() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const t1 = setTimeout(() => el.classList.add('is-diverge'), 3400);
    const t2 = setTimeout(() => el.classList.add('is-darkout'), 4400);
    const t3 = setTimeout(() => el.classList.add('is-glitching'), 4500);
    const t4 = setTimeout(() => el.classList.add('is-glitch-off'), 6700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div ref={rootRef} className="unit5-thanks-wrap" role="status" aria-label="Closing screen">
      <div className="unit5-thanks-text" aria-label="Thank you">
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className="unit5-thanks-letter"
            style={{ '--dx': VECTORS[i][0], '--dy': VECTORS[i][1], '--i': i }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
      <div className="unit5-thanks-sub">— the tomb remembers —</div>
    </div>
  );
}
