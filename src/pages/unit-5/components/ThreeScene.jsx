import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Three.js powered scene for Unit 5 — Mausoleum of Qin Shi Huang.
 *
 * Five low-poly retro scenes (flat shading + warm gold rim light).
 *   1. location  — terraced mountain plateau with a tiny city marker
 *   2. army      — pit of terracotta soldiers standing in a row
 *   3. artistry  — three busts on plinths, each a different face
 *   4. craft     — workbench: hammer, clay bowl, half-built figure
 *   5. mystery   — sealed mound with mercury rivers pulsing beneath
 */

// ---------------- palette (matches mausoleum.css gold/amber) ----------------
const PALETTE = {
  bg:          0x0a0805,
  ground:      0x2a1808,
  ground2:     0x5a3a1c,
  terracotta:  0x8a5a30,
  terracotta2: 0x7a4828,
  skin:        0xd8a878,
  hair:        0x1a0e04,
  gold:        0xc9a35a,
  goldLight:   0xf4e0a8,
  shadow:      0x3a2a14,
  mercury:     0xc9d6e0,
  door:        0x0a0603,
  crimson:     0xb85a3a,
};

// ---------------- helpers ----------------

function lambert(color, extra = {}) {
  return new THREE.MeshLambertMaterial({ color, flatShading: true, ...extra });
}

function box(w, h, d, color, extra) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lambert(color, extra));
}

// ---------------- base scene ----------------

class BaseScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.disposables = [];
  }
  build() {}
  dispose() {
    this.group.parent?.remove(this.group);
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => m?.dispose?.());
    });
    this.disposables.forEach((d) => d.dispose?.());
  }
  update() {}
  setHorror() {}
}

// ---------------- 1. LOCATION ----------------

class LocationScene extends BaseScene {
  build() {
    // Sky — gradient backdrop
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        top:    { value: new THREE.Color(0x3a1f12) },
        bottom: { value: new THREE.Color(0xd68a3a) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragmentShader: `
        uniform vec3 top; uniform vec3 bottom; varying vec2 vUv;
        void main(){ gl_FragColor = vec4(mix(bottom, top, vUv.y), 1.0); }
      `,
      depthWrite: false,
    });
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), skyMat);
    sky.position.set(0, 4, -10);
    this.group.add(sky);
    this.disposables.push(sky.geometry, skyMat);

    // Sun
    const sun = new THREE.Mesh(
      new THREE.CircleGeometry(1.4, 24),
      new THREE.MeshBasicMaterial({ color: PALETTE.goldLight })
    );
    sun.position.set(7, 3.2, -9.9);
    this.group.add(sun);

    // Distant mountains
    const peaks = [
      [-9, 0.6, -8,  4,   3],
      [-5, 1.0, -8,  5,   3.5],
      [ 0, 1.4, -8,  6,   4],
      [ 5, 0.8, -8,  4,   3],
      [ 9, 1.0, -8,  5,   3.2],
    ];
    for (const [x, y, z, w, h] of peaks) {
      const geo = new THREE.ConeGeometry(w, h, 4);
      const m = new THREE.Mesh(geo, lambert(PALETTE.shadow));
      m.position.set(x, y, z);
      this.group.add(m);
      this.disposables.push(geo);
    }

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 14),
      lambert(PALETTE.ground)
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.4;
    this.group.add(ground);

    // City marker
    const city = new THREE.Group();
    const base = box(0.7, 0.7, 0.7, PALETTE.gold);  base.position.y = -0.7; city.add(base);
    const roof = box(0.4, 0.4, 0.4, PALETTE.goldLight); roof.position.y = -0.3; city.add(roof);
    const spire = box(0.15, 0.45, 0.15, PALETTE.gold); spire.position.y = 0.1; city.add(spire);
    city.position.set(-1.5, 0, 0);
    this.group.add(city);

    // Crosshair lines
    const lineMat = new THREE.LineBasicMaterial({ color: PALETTE.goldLight });
    this.group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.2, -0.7, 0), new THREE.Vector3(-0.8, -0.7, 0),
      ]),
      lineMat
    ));
    this.group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.5, -1.4, 0), new THREE.Vector3(-1.5, -0.05, 0),
      ]),
      lineMat
    ));
    this.disposables.push(lineMat);
  }
}

// ---------------- 2. ARMY ----------------

class ArmyScene extends BaseScene {
  build() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 12),
      lambert(PALETTE.ground)
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    this.group.add(floor);

    // Pit walls
    const wallL = box(0.4, 4, 12, PALETTE.shadow); wallL.position.set(-10, 0, 0);
    const wallR = box(0.4, 4, 12, PALETTE.shadow); wallR.position.set( 10, 0, 0);
    this.group.add(wallL, wallR);

    // Roof beam
    const beam = box(20, 0.4, 0.6, PALETTE.shadow);
    beam.position.set(0, 2.2, -5.5);
    this.group.add(beam);

    // 9 soldiers
    for (let i = 0; i < 9; i++) {
      const x = -6.4 + i * 1.6;
      const g = new THREE.Group();

      const shaft = box(0.08, 2.2, 0.08, PALETTE.bg);       shaft.position.y = 0.4;  g.add(shaft);
      const head  = box(0.18, 0.18, 0.18, PALETTE.gold);     head.position.y  = 1.5;  g.add(head);
      const head2 = box(0.4, 0.36, 0.36, PALETTE.skin);      head2.position.y = 0.85; g.add(head2);
      const topknot = box(0.3, 0.18, 0.3, PALETTE.hair);    topknot.position.y = 1.12;g.add(topknot);
      const torso  = box(0.55, 0.75, 0.4, PALETTE.terracotta); torso.position.y = 0.3; g.add(torso);
      const belt   = box(0.56, 0.05, 0.41, PALETTE.hair);   belt.position.y   = 0.18;g.add(belt);
      const armL   = box(0.12, 0.55, 0.18, PALETTE.terracotta); armL.position.set(-0.34, 0.3, 0); g.add(armL);
      const armR   = box(0.12, 0.55, 0.18, PALETTE.terracotta); armR.position.set( 0.34, 0.3, 0); g.add(armR);
      const legL   = box(0.2, 0.7, 0.2, PALETTE.hair);      legL.position.set(-0.13, -0.4, 0); g.add(legL);
      const legR   = box(0.2, 0.7, 0.2, PALETTE.hair);      legR.position.set( 0.13, -0.4, 0); g.add(legR);

      g.position.x = x;
      this.group.add(g);
    }
  }
}

// ---------------- 3. ARTISTRY ----------------

class ArtistryScene extends BaseScene {
  build() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 8),
      lambert(PALETTE.ground)
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    this.group.add(floor);

    const buildBust = (x, skin, hair) => {
      const g = new THREE.Group();
      const plinth = box(1.2, 0.4, 0.9, PALETTE.gold); plinth.position.y = -1.0; g.add(plinth);
      const shoulders = box(1.8, 0.7, 1.0, PALETTE.terracotta); shoulders.position.y = -0.45; g.add(shoulders);
      const neck = box(0.45, 0.3, 0.4, skin); neck.position.y = 0.05; g.add(neck);
      const head = box(1.4, 1.6, 1.2, skin); head.position.y = 1.0; g.add(head);
      const hairTop = box(1.45, 0.45, 1.25, hair); hairTop.position.y = 1.95; g.add(hairTop);
      const eyeL = box(0.15, 0.08, 0.05, PALETTE.hair); eyeL.position.set(-0.3, 1.1, 0.6); g.add(eyeL);
      const eyeR = box(0.15, 0.08, 0.05, PALETTE.hair); eyeR.position.set( 0.3, 1.1, 0.6); g.add(eyeR);
      const brow = box(1.1, 0.05, 0.05, hair); brow.position.set(0, 1.3, 0.6); g.add(brow);
      const mouth = box(0.35, 0.05, 0.05, PALETTE.hair); mouth.position.set(0, 0.55, 0.6); g.add(mouth);
      g.position.x = x;
      return g;
    };

    this.group.add(buildBust(-4, PALETTE.skin, PALETTE.hair));
    this.group.add(buildBust( 0, 0xc89870,    0x3a2a14));
    this.group.add(buildBust( 4, 0xe8c098,    0x5a3a1c));
  }
}

// ---------------- 4. CRAFT ----------------

class CraftScene extends BaseScene {
  build() {
    const bench = box(14, 0.3, 3, PALETTE.ground); bench.position.y = -1.2; this.group.add(bench);
    const edge  = box(14, 0.06, 3, PALETTE.ground2); edge.position.y = -1.04; this.group.add(edge);

    // Hammer
    const hammer = new THREE.Group();
    const hHead = box(1.0, 0.4, 0.4, 0x8a7a5a); hHead.position.y = 0.2; hammer.add(hHead);
    const hHandle = box(0.2, 1.4, 0.2, 0x5a4624); hHandle.position.y = -0.5; hammer.add(hHandle);
    hammer.position.set(-4.5, -0.6, 0.2);
    hammer.rotation.z = -0.4;
    this.group.add(hammer);

    // Clay bowl + clay mound
    const bowlGeo = new THREE.CylinderGeometry(0.9, 0.7, 0.5, 16, 1, true);
    const bowl = new THREE.Mesh(bowlGeo, lambert(PALETTE.terracotta, { side: THREE.DoubleSide }));
    bowl.position.set(0, -0.95, 0.3);
    this.group.add(bowl);
    this.disposables.push(bowlGeo);

    const clay = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      lambert(PALETTE.terracotta2)
    );
    clay.position.set(0, -0.7, 0.3);
    this.group.add(clay);

    // Half-built figure on stand
    const stand  = box(1.0, 0.3, 1.0, PALETTE.shadow);      stand.position.set(3.5, -0.95, 0); this.group.add(stand);
    const torso  = box(0.9, 1.0, 0.5, PALETTE.terracotta); torso.position.set(3.5, -0.05, 0); this.group.add(torso);
    const head   = box(0.7, 0.7, 0.55, PALETTE.skin);      head.position.set(3.5,  0.85, 0); this.group.add(head);
    const hairT  = box(0.72, 0.2, 0.57, PALETTE.hair);     hairT.position.set(3.5,  1.3, 0); this.group.add(hairT);
    const arm    = box(0.25, 0.7, 0.25, PALETTE.terracotta); arm.position.set(2.95, 0.0, 0.2); this.group.add(arm);

    // Sparks
    for (let i = 0; i < 6; i++) {
      const s = box(0.06, 0.06, 0.06, PALETTE.goldLight);
      s.position.set(
        3.5 + (Math.random() - 0.5) * 1.4,
        0.3 + Math.random() * 1.4,
        0.4 + (Math.random() - 0.5) * 0.3
      );
      this.group.add(s);
    }
  }
}

// ---------------- 5. MYSTERY ----------------

class MysteryScene extends BaseScene {
  build() {
    // Dark glow backdrop sphere
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x1a1408, side: THREE.BackSide });
    const halo = new THREE.Mesh(new THREE.SphereGeometry(20, 16, 12), haloMat);
    this.group.add(halo);
    this.disposables.push(halo.geometry, haloMat);

    // Tomb mound — 3 stacked cones
    const m1 = new THREE.Mesh(new THREE.ConeGeometry(5, 2.8, 6), lambert(PALETTE.shadow));
    m1.position.y = -0.4; this.group.add(m1);
    const m2 = new THREE.Mesh(new THREE.ConeGeometry(3.6, 1.6, 6), lambert(PALETTE.ground));
    m2.position.y = 0.6; this.group.add(m2);
    const m3 = new THREE.Mesh(new THREE.ConeGeometry(2.0, 0.8, 6), lambert(PALETTE.ground2));
    m3.position.y = 1.2; this.group.add(m3);

    // Sealed door
    const door = box(0.8, 1.0, 0.1, PALETTE.door); door.position.set(0, -0.9, 1.8);
    const inset = box(0.6, 0.8, 0.05, PALETTE.bg); inset.position.set(0, -0.9, 1.85);
    this.group.add(door, inset);

    // Mercury rivers (animated)
    this.rivers = [];
    const riverMat = new THREE.MeshBasicMaterial({
      color: PALETTE.mercury,
      transparent: true,
      opacity: 0.7,
    });
    for (let r = 0; r < 3; r++) {
      const segs = 60;
      const points = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        points.push(new THREE.Vector3(
          (t - 0.5) * 14,
          -1.5 - r * 0.18,
          1.0 + Math.sin(t * Math.PI * 2 + r) * 0.1
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.04 - r * 0.008, 6, false);
      const tube = new THREE.Mesh(tubeGeo, riverMat);
      this.group.add(tube);
      this.rivers.push({ tube, r });
      this.disposables.push(tubeGeo);
    }
    this.disposables.push(riverMat);

    // Floating lock
    this.lock = new THREE.Group();
    const lockBody = box(0.8, 0.6, 0.25, PALETTE.goldLight);
    this.lock.add(lockBody);
    const lockShackle = new THREE.Mesh(
      new THREE.TorusGeometry(0.25, 0.07, 6, 12, Math.PI),
      lambert(PALETTE.gold)
    );
    lockShackle.rotation.z = Math.PI;
    lockShackle.position.y = 0.3;
    this.lock.add(lockShackle);
    this.lock.position.set(0, 2.4, 0.5);
    this.group.add(this.lock);

    // Faint crimson seal
    const seal = box(0.6, 0.6, 0.05, PALETTE.crimson);
    seal.position.set(-3.2, -1.0, 0.5);
    this.group.add(seal);
  }

  update(t) {
    for (const r of this.rivers || []) {
      const pos = r.tube.geometry.attributes.position;
      const arr = pos.array;
      for (let i = 0; i < arr.length; i += 3) {
        const ox = arr[i];
        arr[i + 1] += Math.sin(t * 0.001 + ox * 0.6 + r.r) * 0.0015;
      }
      pos.needsUpdate = true;
    }
    if (this.lock) {
      this.lock.position.y = 2.4 + Math.sin(t * 0.0014) * 0.12;
      this.lock.rotation.y = t * 0.0003;
    }
  }

  setHorror(active) {
    if (!this.rivers) return;
    for (const r of this.rivers) {
      r.tube.material.opacity = active ? 0.95 : 0.7;
    }
  }
}

// ---------------- scene registry ----------------

const SCENE_CLASSES = {
  location: LocationScene,
  army:     ArmyScene,
  artistry: ArtistryScene,
  craft:    CraftScene,
  mystery:  MysteryScene,
};

// ---------------- React component ----------------

export default function ThreeScene({ kind = 'location', horror = false, className }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  // Hold Three.js objects in a ref so the mount effect can clean them up
  // and the kind/horror effect can reach them. The object is created once
  // and reused across mount/unmount cycles (React 19 StrictMode runs the
  // mount effect twice in development — if we set this to null in cleanup,
  // the second mount would crash trying to read .kind on null).
  const stateRef = useRef({ kind, horror });

  // Mount: build renderer + scene + lighting.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(PALETTE.bg, 1);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.bg);
    scene.fog = new THREE.Fog(PALETTE.bg, 8, 22);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.2, 9);
    camera.lookAt(0, 0.2, 0);

    const ambient = new THREE.AmbientLight(0xfff0d0, 0.55);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xfff0c8, 1.1);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);
    const rim = new THREE.DirectionalLight(PALETTE.gold, 0.7);
    rim.position.set(-5, 3, -4);
    scene.add(rim);

    let current = null;
    const setKind = (nextKind) => {
      const K = SCENE_CLASSES[nextKind] || SCENE_CLASSES.location;
      if (current) current.dispose();
      current = new K(scene);
      current.build();
    };
    const setHorror = (active) => current?.setHorror?.(active);

    setKind(stateRef.current.kind);
    setHorror(stateRef.current.horror);

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

    const clock = new THREE.Clock();
    let raf;
    const draw = () => {
      const t = clock.getElapsedTime();
      current?.update?.(t * 1000, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    stateRef.current.renderer = renderer;
    stateRef.current.scene    = scene;
    stateRef.current.camera   = camera;
    stateRef.current.ro       = ro;
    stateRef.current.raf      = () => cancelAnimationFrame(raf);
    stateRef.current.setKind  = setKind;
    stateRef.current.setHorror = setHorror;
    stateRef.current.current  = () => current;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      current?.dispose?.();
      renderer.dispose();
      // Clear the three.js refs but keep the {kind, horror} shell so a
      // re-mount (StrictMode) can still read them safely.
      stateRef.current.renderer  = null;
      stateRef.current.scene     = null;
      stateRef.current.camera    = null;
      stateRef.current.ro        = null;
      stateRef.current.raf       = null;
      stateRef.current.setKind   = null;
      stateRef.current.setHorror = null;
      stateRef.current.current   = null;
    };
  }, []);

  // Reactive updates: scene kind + horror toggle.
  useEffect(() => {
    stateRef.current.kind = kind;
    stateRef.current.horror = horror;
    stateRef.current.setKind?.(kind);
    stateRef.current.setHorror?.(horror);
  }, [kind, horror]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="unit5-three-canvas" />
    </div>
  );
}