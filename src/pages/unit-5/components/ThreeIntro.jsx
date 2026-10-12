import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Three.js powered tomb entrance / start screen.
 *
 * Renders an animated 3D scene: a stepped pyramid mound, a stone doorway
 * with two halves that split open, dust motes, and a warm volumetric
 * light spilling out. On click, the doors open, the light flares, and
 * the screen wipes down before signalling `onEnter()`.
 *
 * Owns its own renderer (no shared Three.js context).
 */
export default function ThreeIntro({ onEnter }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const [phase, setPhase]   = useState('idle'); // idle | opening | gone
  const [hinted, setHinted] = useState(false);

  // ---- Hint pulse ----
  useEffect(() => {
    const t = setTimeout(() => setHinted(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // ---- Click / keyboard ----
  const handleEnter = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    setTimeout(() => onEnter?.(), 2100);
    setTimeout(() => setPhase('gone'), 2700);
  };
  useEffect(() => {
    const k = (e) => {
      if (phase === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ---- Three.js scene ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // transparent — CSS gradient shows through

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0e0908, 6, 18);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.8, 7);
    camera.lookAt(0, 0.6, 0);

    // Lighting — moody warm
    const ambient = new THREE.AmbientLight(0x4a3a28, 0.7);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xc9a35a, 0.6);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);
    const doorLight = new THREE.PointLight(0xffa050, 1.0, 10, 2);
    doorLight.position.set(0, 0.6, 0.8);
    scene.add(doorLight);

    // ----- Tomb mound — stepped pyramid (4 truncated cones) -----
    const moundGroup = new THREE.Group();
    const tiers = [
      { r: 3.0, h: 0.6, y: -0.6, c: 0x3b2a1c },
      { r: 2.4, h: 0.6, y:  0.0, c: 0x2a1a10 },
      { r: 1.8, h: 0.6, y:  0.6, c: 0x1f140d },
      { r: 1.2, h: 0.6, y:  1.2, c: 0x1a0e08 },
    ];
    for (const t of tiers) {
      const geo = new THREE.CylinderGeometry(t.r * 0.7, t.r, t.h, 6);
      const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({
        color: t.c, flatShading: true,
      }));
      m.position.y = t.y;
      moundGroup.add(m);
    }
    scene.add(moundGroup);

    // ----- Doorway (two halves that split open) -----
    const doorGroup = new THREE.Group();
    doorGroup.position.set(0, 0.2, 2.1);

    const doorMat = new THREE.MeshLambertMaterial({
      color: 0x2a1a10, flatShading: true, side: THREE.DoubleSide,
    });
    const doorGeo = new THREE.BoxGeometry(0.55, 1.3, 0.12);
    const doorL = new THREE.Mesh(doorGeo, doorMat);
    doorL.position.x = -0.28;
    const doorR = new THREE.Mesh(doorGeo, doorMat);
    doorR.position.x =  0.28;
    doorGroup.add(doorL, doorR);

    // Doorframe — vertical stone pillars + lintel
    const pillarGeo = new THREE.BoxGeometry(0.18, 1.6, 0.18);
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0x6e5727, flatShading: true });
    const pl = new THREE.Mesh(pillarGeo, pillarMat);
    pl.position.set(-0.55, 0, 0);
    const pr = new THREE.Mesh(pillarGeo, pillarMat);
    pr.position.set( 0.55, 0, 0);
    doorGroup.add(pl, pr);

    const lintel = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.18, 0.18),
      pillarMat
    );
    lintel.position.y = 0.85;
    doorGroup.add(lintel);

    // Inner glow (visible when door opens) — a flat plane behind the doors
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffa050,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.2), glowMat);
    glow.position.z = -0.05;
    doorGroup.add(glow);

    // Glyph plates — left + right of the door
    const glyphMat = new THREE.MeshLambertMaterial({
      color: 0xc9a35a, flatShading: true, emissive: 0x4a2a14,
    });
    const glyphGeo = new THREE.PlaneGeometry(0.3, 0.3);
    const glyphL = new THREE.Mesh(glyphGeo, glyphMat);
    glyphL.position.set(-0.7, 1.05, 0.1);
    const glyphR = new THREE.Mesh(glyphGeo, glyphMat);
    glyphR.position.set( 0.7, 1.05, 0.1);
    doorGroup.add(glyphL, glyphR);

    scene.add(doorGroup);

    // ----- Dust motes (300 small particles drifting) -----
    const dustCount = 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustVel = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3 + 0] = (Math.random() - 0.5) * 16;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      dustVel[i * 3 + 0] = (Math.random() - 0.5) * 0.0015;
      dustVel[i * 3 + 1] = -0.0005 - Math.random() * 0.0015;
      dustVel[i * 3 + 2] = (Math.random() - 0.5) * 0.0015;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xc9a35a,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ----- Volumetric beam (cone of light pouring from the door) -----
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffa050,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const beamGeo = new THREE.ConeGeometry(2.5, 6, 24, 1, true);
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, -1, 4.2);
    beam.rotation.x = Math.PI; // tip pointing up at the door
    scene.add(beam);

    // ----- Resize -----
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ----- Animation loop -----
    const clock = new THREE.Clock();
    let raf;
    let openT = 0; // 0 = closed, 1 = fully open
    const draw = () => {
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      // Door open animation
      const target = phase === 'opening' ? 1 : 0;
      openT += (target - openT) * 0.05;
      doorL.rotation.y =  openT * 1.2;
      doorR.rotation.y = -openT * 1.2;
      doorL.position.x = -0.28 - openT * 0.3;
      doorR.position.x =  0.28 + openT * 0.3;
      glowMat.opacity = openT * 0.85;
      doorLight.intensity = 0.5 + openT * 2.2;

      // Glyphs glow then drift away
      glyphMat.emissive.setRGB(0.3 + openT * 0.7, 0.15 + openT * 0.4, 0.05 + openT * 0.15);
      glyphL.position.x = -0.7 - openT * 0.4;
      glyphR.position.x =  0.7 + openT * 0.4;

      // Beam flares then fades
      const beamT = Math.max(0, openT - 0.2);
      beamMat.opacity = beamT * 0.35;
      beam.scale.set(0.4 + beamT * 0.8, 0.4 + beamT * 1.2, 0.4 + beamT * 0.8);

      // Dust drift
      const positions = dustGeo.attributes.position.array;
      for (let i = 0; i < dustCount; i++) {
        const ix = i * 3;
        positions[ix + 0] += dustVel[ix + 0] + Math.sin(t * 0.5 + i) * 0.001;
        positions[ix + 1] += dustVel[ix + 1];
        positions[ix + 2] += dustVel[ix + 2];
        if (positions[ix + 1] < -4) {
          positions[ix + 1] = 4;
          positions[ix + 0] = (Math.random() - 0.5) * 16;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Tomb gentle "breathing" scale
      moundGroup.scale.y = 1 + Math.sin(t * 0.6) * 0.005;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      // dispose geometries/materials we created
      [doorGeo, pillarGeo, glyphGeo, beamGeo, dustGeo].forEach((g) => g.dispose());
      [doorMat, pillarMat, glyphMat, beamMat, dustMat, glowMat].forEach((m) => m.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      className={`unit5-intro ${phase === 'opening' ? 'is-opening' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Enter the mausoleum"
      onClick={handleEnter}
    >
      <div className="unit5-intro__vignette" aria-hidden="true" />
      <div className="unit5-intro__horizon" aria-hidden="true" />

      <div ref={containerRef} className="unit5-intro__canvas-wrap">
        <canvas ref={canvasRef} className="unit5-intro__canvas" />
      </div>

      <div className="unit5-intro__copy">
        <p className="unit5-intro__kicker">// FILE 05 · SEALED SINCE THE FIRST EMPEROR //</p>
        <h1 className="unit5-intro__title">MAUSOLEUM<br/><em>OF&nbsp;QIN SHI HUANG</em></h1>
      </div>

      <div className={`unit5-intro__hint ${hinted ? 'is-hinted' : ''}`}>
        <span className="unit5-intro__hint-pulse" />
        <span className="unit5-intro__hint-text">CLICK&nbsp;THE&nbsp;TOMB&nbsp;TO&nbsp;ENTER&nbsp;&nbsp;▾</span>
      </div>

      <div className="unit5-intro__ramp" aria-hidden="true">
        <div className="unit5-intro__ramp-scan" />
      </div>
    </div>
  );
}