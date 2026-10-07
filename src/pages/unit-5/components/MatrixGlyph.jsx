import { useEffect, useRef } from 'react';

// Canvas-based "matrix rain" terminal header.
// Falls Chinese chars + Latin glyphs in columns; "QIN SHI HUANG" burns in
// at the centre in bright gold while the rest fade.
const CHARSET =
  'QINSHIhuangziSANLIANGDIER任帝勿易人世史壬事于秦始皇兵马俑年国子天子民' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' +
  'TERRACOTTAXIANTOMBSEALEDOPENEDRIVERSMERCURY' +
  '朕寡人丞相御史大夫宫三千内奇宠';

const TARGET = 'QIN SHI HUANG'; // 13 chars incl. spaces -> 'Q','I','N',' ','S','H','I',' ','H','U','A','N','G'
const TARGET_LEN = TARGET.length;

function randChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

export default function MatrixGlyph({ height = 96 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = height;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    // Mono cell
    const cell = 24;         // px per char cell — large glyphs
    const cols = Math.floor(cssW / cell);
    const rows = Math.floor(cssH / cell);

    // Column state: how far down the head has fallen
    const drops = new Array(cols).fill(0).map(() => Math.random() * rows);

    // Pick a few columns to carry the gold target text
    // Center columns align to roughly the middle of the canvas
    const startCol = Math.max(0, Math.floor((cols - TARGET_LEN) / 2));
    const targetCols = new Set();
    for (let i = 0; i < TARGET_LEN; i++) targetCols.add(startCol + i);
    // Target band: one fixed row near the middle where the gold text always sits
    const targetRow = Math.floor(rows * 0.45);
    let flickerPhase = 0;

    const draw = () => {
      // Trail fade — translucent black wash
      ctx.fillStyle = 'rgba(10, 8, 5, 0.18)';
      ctx.fillRect(0, 0, cssW, cssH);

    ctx.font = `${cell - 4}px "Courier New", monospace`;
    ctx.textBaseline = 'top';

      for (let c = 0; c < cols; c++) {
        const yHead = drops[c] * cell;
        const inTarget = targetCols.has(c);

        // === TARGET BAND: stable gold text at the middle row ===
        if (inTarget) {
          const targetChar = TARGET[c - startCol];
          // Show with random flicker — some columns momentarily scramble
          const scrambled = Math.random() < 0.08;
          const ch = scrambled ? randChar() : targetChar;
          const brightness = Math.random();
          let color;
          if (scrambled) {
            color = '#6e5727';
          } else if (brightness > 0.95) {
            color = '#fff7d8';       // hot highlight
          } else if (brightness > 0.6) {
            color = '#f4e0a8';       // bright gold
          } else {
            color = '#c9a35a';       // muted gold
          }
          ctx.fillStyle = color;
          if (!scrambled) {
            ctx.shadowColor = 'rgba(255, 195, 90, 0.55)';
            ctx.shadowBlur = 5;
          }
          ctx.fillText(ch, c * cell, targetRow * cell);
          ctx.shadowBlur = 0;
        }

        // === RAIN: regular falling chars in non-target columns ===
        if (!inTarget) {
          const ch = randChar();
          const distFromHead = Math.random();
          let color;
          if (distFromHead > 0.85) color = '#c9a35a';
          else if (distFromHead > 0.5) color = '#6e5727';
          else color = '#3a2a14';
          ctx.fillStyle = color;
          ctx.fillText(ch, c * cell, yHead);
        }

        // Advance head (only for non-target columns; target stays put)
        if (!inTarget && yHead > cssH && Math.random() > 0.975) {
          drops[c] = 0;
        } else if (!inTarget) {
          drops[c] += 0.5 + Math.random() * 0.5;
        }
      }

      // Slow flicker overlay across the whole canvas
      flickerPhase++;
      if (flickerPhase % 80 < 4) {
        ctx.fillStyle = 'rgba(255, 195, 90, 0.08)';
        ctx.fillRect(0, 0, cssW, cssH);
      }

      // Faint scanline overlay
      ctx.fillStyle = 'rgba(255, 195, 90, 0.04)';
      for (let y = 0; y < cssH; y += 3) {
        ctx.fillRect(0, y, cssW, 1);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      canvas.width = w * dpr;
      canvas.height = cssH * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [height]);

  return (
    <div className="unit5-matrix" aria-hidden="true">
      <canvas ref={canvasRef} className="unit5-matrix-canvas" />
      <span className="unit5-matrix-label">// FILE 05</span>
    </div>
  );
}