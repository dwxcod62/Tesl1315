import { useEffect, useRef, useCallback } from 'react';

/**
 * Vintage CRT TV interference — replaces the old crimson "streak" effect.
 * Layers (bottom → top):
 *   1. Bayer-ordered dithered static (sepia tone, 4×4 matrix)
 *   2. Scanline roll (bright/dark bands drifting down)
 *   3. Vertical hold slip (a clipped slice that bounces)
 *   4. RGB fringe (3 ghosts of the page drifting ±4px)
 *   5. Bottom tracking distortion bar (height wobble)
 *   6. Tape hiss noise (high-frequency speckle)
 */
export default function TvStatic({ id, duration = 900 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  const stopRef = useRef(false);

  const stop = useCallback(() => {
    stopRef.current = true;
    cancelAnimationFrame(rafRef.current);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (wrapRef.current) wrapRef.current.classList.remove('is-active');
  }, []);

  useEffect(() => {
    const cvs = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cvs || !wrap) return;

    // Activate
    requestAnimationFrame(() => wrap.classList.add('is-active'));

    const ctx = cvs.getContext('2d');
    let w = (cvs.width = window.innerWidth);
    let h = (cvs.height = window.innerHeight);
    const onResize = () => { w = cvs.width = window.innerWidth; h = cvs.height = window.innerHeight; };
    window.addEventListener('resize', onResize);

    // ---- 4×4 Bayer matrix (values 0..15) ----
    const bayer = [
      [ 0,  8,  2, 10],
      [12,  4, 14,  6],
      [ 3, 11,  1,  9],
      [15,  7, 13,  5],
    ];

    // ---- Build a Bayer-dithered static ImageData once. Re-render it per
    // frame, shifting the offset to produce the "vertical hold slip" feel. ----
    const block = 4; // pixel size of each Bayer cell
    const cols = Math.ceil(w / block) + 2;
    const rows = Math.ceil(h / block) + 2;
    const tile = document.createElement('canvas');
    tile.width = cols * block;
    tile.height = rows * block;
    const tctx = tile.getContext('2d');
    const tdata = tctx.createImageData(tile.width, tile.height);
    const td = tdata.data;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const threshold = bayer[y & 3][x & 3] * 16; // 0..240
        for (let py = 0; py < block; py++) {
          for (let px = 0; px < block; px++) {
            const i = ((y * block + py) * tile.width + (x * block + px)) * 4;
            // Slight random jitter on top of Bayer so the pattern feels alive
            const v = (threshold + (Math.random() * 40) | 0) > 200 ? 230 : 20;
            // Sepia-tinted static
            td[i] = Math.min(255, v + 12);
            td[i + 1] = Math.min(255, v * 0.85);
            td[i + 2] = Math.min(255, v * 0.55);
            td[i + 3] = 255;
          }
        }
      }
    }
    tctx.putImageData(tdata, 0, 0);

    // ---- Scanline overlay: repeating horizontal bands drawn as a tiling pattern ----
    const scanCvs = document.createElement('canvas');
    scanCvs.width = 4;
    scanCvs.height = 6;
    const sctx = scanCvs.getContext('2d');
    sctx.fillStyle = 'rgba(0,0,0,0.35)';
    sctx.fillRect(0, 0, 4, 3);
    sctx.fillStyle = 'rgba(255, 230, 180, 0.05)';
    sctx.fillRect(0, 3, 4, 1);
    sctx.fillStyle = 'rgba(0,0,0,0.20)';
    sctx.fillRect(0, 4, 4, 2);
    const scanPattern = ctx.createPattern(scanCvs, 'repeat');

    const start = performance.now();
    stopRef.current = false;

    const draw = (t) => {
      if (stopRef.current) return;
      const elapsed = t - start;
      const progress = Math.min(1, elapsed / duration);

      // 1. Bayer dithered static, offset shifts each frame
      const ox = (Math.random() * 16 - 8) | 0;
      const oy = (Math.random() * 24 - 12) | 0;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.drawImage(tile, ox, oy);

      // 2. Scanline roll
      if (scanPattern) {
        ctx.globalAlpha = 0.85;
        const rollY = (elapsed * 0.08) % 6;
        ctx.save();
        ctx.translate(0, rollY);
        ctx.fillStyle = scanPattern;
        ctx.fillRect(0, 0, w, h + 6);
        ctx.restore();
      }

      // 3. Vertical hold slip — clip a slice, draw it again offset
      const slipY = Math.sin(elapsed * 0.025) * (h * 0.18) + h * 0.32;
      const slipH = (h * 0.08) + Math.sin(elapsed * 0.05) * 20;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, slipY, w, slipH);
      ctx.clip();
      // Draw the page content under that slice by re-rasterising the same tile
      // with horizontal jitter — gives a "what's underneath got shifted" feel.
      ctx.drawImage(tile, ox + (Math.random() * 8 - 4) | 0, oy + (Math.random() * 12 - 6) | 0);
      ctx.restore();

      // 4. Bottom tracking distortion bar
      const barH = 40 + Math.sin(elapsed * 0.04) * 18;
      const barY = h - barH;
      const grad = ctx.createLinearGradient(0, barY, 0, h);
      grad.addColorStop(0, 'rgba(255, 230, 180, 0)');
      grad.addColorStop(0.4, 'rgba(255, 230, 180, 0.18)');
      grad.addColorStop(0.7, 'rgba(184, 30, 30, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, barY, w, barH);

      // 5. Tape hiss — high-frequency speckle on top
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 80; i++) {
        const x = (Math.random() * w) | 0;
        const y = (Math.random() * h) | 0;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
        ctx.fillRect(x, y, 2, 1);
      }

      // 6. RGB fringe (chromatic aberration look) — three offset redraws
      ctx.globalAlpha = 0.18;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(tile, ox - 3, oy);
      ctx.drawImage(tile, ox + 3, oy);
      ctx.globalCompositeOperation = 'source-over';

      // 7. Vellum flicker
      ctx.globalAlpha = 0.06 + Math.sin(elapsed * 0.04) * 0.04;
      ctx.fillStyle = '#f4e0a8';
      ctx.fillRect(0, 0, w, h);

      ctx.globalAlpha = 1;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        stop();
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    // Auto-stop after duration (safety net for tab throttle)
    const auto = setTimeout(stop, duration + 80);

    return () => {
      stop();
      clearTimeout(auto);
      window.removeEventListener('resize', onResize);
    };
  }, [duration, stop]);

  return (
    <div ref={wrapRef} className="unit5-tvstatic" aria-hidden="true">
      <canvas ref={canvasRef} className="unit5-tvstatic__canvas" />
    </div>
  );
}