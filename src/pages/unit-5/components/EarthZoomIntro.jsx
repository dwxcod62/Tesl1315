import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { gsap } from 'gsap';
import './EarthZoomIntro.css';

/* ================================================================
   Cinematic Earth-to-Mausoleum zoom experience for UNIT 5.

   Sequence (driven by a GSAP timeline):
     1. Outer space — globe in profile, slow rotation.
     2. Zoom toward Earth, easing into a view of Asia.
     3. Cinematic pull-in toward Shaanxi / Xi'an.
     4. Approach the Mausoleum of the First Qin Emperor.
     5. Final destination reveal + info panel + replay.

   Public API:
     <EarthZoomIntro onEnter={() => …} />
     onEnter  — called when the user dismisses the final destination
                panel (via the "Enter the Mausoleum" button).

   Environment:
     VITE_CESIUM_ION_TOKEN  — optional. If absent or invalid, we fall
     back to Cesium's open Natural Earth II imagery, which does not
     require a token.
   ================================================================ */

const MAUSOLEUM = {
  // Approximate location of the Qin Shi Huang Mausoleum archaeological
  // site, ~5 km north of the Lintong District of Xi'an, Shaanxi.
  lon: 109.2655,
  lat: 34.3853,
  heightMeters: 1500, // final altitude
};

// Camera waypoints — each entry is what the camera should look at
// (lon, lat, alt metres, heading°, pitch°). `dur` is the timeline
// segment duration in seconds.
const WAYPOINTS = [
  { lon:   0,    lat:  15, alt: 20_000_000, heading:   0, pitch: -89, dur: 0.0  }, // start
  { lon:  60,    lat:  20, alt: 14_000_000, heading:   5, pitch: -82, dur: 4.5  }, // 1 → 2
  { lon:  90,    lat:  30, alt:  9_000_000, heading:  10, pitch: -72, dur: 3.5  }, // 2 → 3 (Asia)
  { lon: 105,    lat:  33, alt:  3_500_000, heading:  15, pitch: -55, dur: 3.0  }, // 3 → 4 (China)
  { lon: 108.5,  lat:  34.2, alt: 1_200_000, heading:  20, pitch: -45, dur: 2.5 }, // 4 → 5 (Shaanxi)
  { lon: MAUSOLEUM.lon, lat: MAUSOLEUM.lat, alt: 220_000, heading: 25, pitch: -38, dur: 2.0 }, // 5 → 6 (orbit the site)
  { lon: MAUSOLEUM.lon, lat: MAUSOLEUM.lat, alt: MAUSOLEUM.heightMeters, heading: 30, pitch: -32, dur: 2.0 }, // 6 → 7 (final)
];

// ----------------------------------------------------------------------------
// Cesium token setup
// ----------------------------------------------------------------------------
const ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN;
if (ION_TOKEN && typeof Cesium.Ion?.defaultAccessToken === 'function') {
  Cesium.Ion.defaultAccessToken = ION_TOKEN;
}

// ----------------------------------------------------------------------------
// Small helper — keep `viewer.scene.requestRender()` cheap by only
// running the render loop while we are animating or have a clock tick.
// ----------------------------------------------------------------------------
function useCesiumViewer(containerRef) {
  // The viewer instance is stored in a ref so the heavy 3D object
  // doesn't trigger re-renders. A separate piece of state flips once
  // it's actually ready, so effects that depend on the viewer can
  // wait for it.
  const viewerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let viewer;
    try {
      viewer = new Cesium.Viewer(container, {
        // We configure our own provider below — avoid the default
        // Bing/Ion imagery call (it would 401 without a token).
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        timeline: false,
        animation: false,
        fullscreenButton: false,
        navigationHelpButton: false,
        selectionIndicator: false,
        infoBox: false,
        // We render the canvas itself transparent so the CSS space
        // background + stars show through. Cesium still paints the
        // globe on top.
        skyBox: false,
        skyAtmosphere: true,
        contextOptions: { webgl: { alpha: true, preserveDrawingBuffer: false } },
      });
    } catch (e) {
      setError(e);
      return undefined;
    }

    // ---- Imagery provider (graceful fallback) ----
    try {
      const layers = viewer.imageryLayers;
      layers.removeAll();
      if (ION_TOKEN) {
        // Best-looking path: Cesium Ion's Bing satellite imagery.
        const provider = new Cesium.IonImageryProvider({
          assetId: 2, // Bing Maps Aerial — public Cesium Ion asset.
        });
        layers.addImageryProvider(provider);
      } else {
        // No token — fall back to the open Natural Earth II tiles.
        const provider = new Cesium.TileMapServiceImageryProvider({
          url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII'),
        });
        layers.addImageryProvider(provider);
      }
    } catch (e) {
      // Imagery failure is non-fatal — the globe still renders
      // with a default solid color. We swallow this so it doesn't
      // mask a viewer init error.
      void e;
    }

    // ---- Visual polish ----
    const scene = viewer.scene;
    scene.backgroundColor = Cesium.Color.TRANSPARENT;
    scene.globe.enableLighting = true;
    scene.globe.showGroundAtmosphere = true;
    scene.globe.atmosphereLightIntensity = 8.0;
    scene.skyAtmosphere.show = true;
    scene.sun.show = true;
    scene.moon.show = true;
    scene.fog.enabled = false;
    scene.requestRenderMode = false; // continuous render keeps the camera smooth

    // Remove the default credit container so it doesn't cover the UI.
    if (viewer.cesiumWidget?.creditContainer) {
      viewer.cesiumWidget.creditContainer.style.display = 'none';
    }

    // Disable user interaction during intro. The user gets a free
    // interactive view only once the journey has completed.
    scene.screenSpaceCameraController.enableInputs = false;
    scene.screenSpaceCameraController.enableTranslate = false;
    scene.screenSpaceCameraController.enableZoom = false;
    scene.screenSpaceCameraController.enableRotate = false;
    scene.screenSpaceCameraController.enableTilt = false;
    scene.screenSpaceCameraController.enableLook = false;

    viewerRef.current = viewer;
    setReady(true);
    return () => {
      try {
        viewer.destroy();
      } catch (e) {
        void e;
      }
      viewerRef.current = null;
      setReady(false);
    };
  }, [containerRef]);

  return { viewerRef, ready, error };
}

// ----------------------------------------------------------------------------
// Camera helpers
// ----------------------------------------------------------------------------
function flyTo(viewer, { lon, lat, alt, heading, pitch }, duration) {
  return viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
    orientation: {
      heading: Cesium.Math.toRadians(heading),
      pitch: Cesium.Math.toRadians(pitch),
      roll: 0,
    },
    duration,
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
  });
}

function setCamera(viewer, { lon, lat, alt, heading, pitch }) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
    orientation: {
      heading: Cesium.Math.toRadians(heading),
      pitch: Cesium.Math.toRadians(pitch),
      roll: 0,
    },
  });
}

// ----------------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------------
export default function EarthZoomIntro({ onEnter }) {
  const containerRef = useRef(null);
  const { viewerRef, ready: viewerReady, error } = useCesiumViewer(containerRef);

  const [loaded, setLoaded] = useState(false);
  const [stage, setStage] = useState('intro'); // intro → journey → final
  const [skipping, setSkipping] = useState(false);

  const timelineRef = useRef(null);
  const runningRef  = useRef(false);

  // ------------------------------------------------------------
  // Once the Cesium viewer is ready, mark loaded and start a
  // slow autonomous spin while we're still in the intro.
  // ------------------------------------------------------------
  useEffect(() => {
    if (!viewerReady) return undefined;
    // Defer the "loaded" flag a tick so the loader cross-fades after
    // the first frame has actually painted.
    const t = setTimeout(() => setLoaded(true), 350);
    return () => clearTimeout(t);
  }, [viewerReady]);

  // Slow continuous spin on the idle intro — looks alive in space.
  useEffect(() => {
    if (!viewerReady || !loaded || stage !== 'intro') return undefined;
    const v = viewerRef.current;
    if (!v) return undefined;
    const spinClock = new Cesium.Clock({
      startTime: Cesium.JulianDate.now(),
      currentTime: Cesium.JulianDate.now(),
      stopTime: Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), 1, new Cesium.JulianDate()),
      clockRange: Cesium.ClockRange.LOOP_STOP,
      multiplier: 60,
    });
    v.clock.shouldAnimate = true;
    v.clock.startTime   = spinClock.startTime;
    v.clock.stopTime    = spinClock.stopTime;
    v.clock.currentTime = spinClock.currentTime;
    v.clock.multiplier  = spinClock.multiplier;
    v.clock.clockRange  = spinClock.clockRange;
    v.timeline?.zoomTo(spinClock.startTime, spinClock.stopTime);
    return () => {
      v.clock.shouldAnimate = false;
    };
  }, [viewerReady, loaded, stage, viewerRef]);

  // ------------------------------------------------------------
  // Start / skip / replay helpers
  // ------------------------------------------------------------
  const startJourney = () => {
    const v = viewerRef.current;
    if (!v || runningRef.current) return;
    runningRef.current = true;
    setStage('journey');

    // Stop the idle spin clock.
    v.clock.shouldAnimate = false;

    // Build the waypoint timeline. Each segment uses Cesium's
    // native `flyTo` for the actual camera movement.
    const tl = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      onComplete: () => {
        runningRef.current = false;
        setStage('final');
        // Hand camera control back to the user once we land.
        const sc = v.scene.screenSpaceCameraController;
        sc.enableInputs = true;
        sc.enableTranslate = true;
        sc.enableZoom = true;
        sc.enableRotate = true;
        sc.enableTilt = true;
        sc.enableLook = true;
      },
    });

    let elapsed = 0;
    for (let i = 0; i < WAYPOINTS.length - 1; i++) {
      const b = WAYPOINTS[i + 1];
      // eslint-disable-next-line no-loop-func
      tl.call(() => {
        flyTo(v, b, b.dur);
      }, [], elapsed);
      elapsed += b.dur;
    }

    timelineRef.current = tl;
  };

  const skipToFinal = () => {
    const v = viewerRef.current;
    if (!v) return;
    if (stage === 'final') return;
    setSkipping(true);
    setStage('final');
    runningRef.current = false;
    timelineRef.current?.kill();
    timelineRef.current = null;
    // Skip straight to the final waypoint with a fast easing.
    flyTo(v, WAYPOINTS[WAYPOINTS.length - 1], 1.2).then(() => {
      const sc = v.scene.screenSpaceCameraController;
      sc.enableInputs = true;
      sc.enableTranslate = true;
      sc.enableZoom = true;
      sc.enableRotate = true;
      sc.enableTilt = true;
      sc.enableLook = true;
      setSkipping(false);
    });
  };

  const replay = () => {
    const v = viewerRef.current;
    if (!v) return;
    setStage('intro');
    // Briefly disable inputs while we rewind.
    const sc = v.scene.screenSpaceCameraController;
    sc.enableInputs = false;
    sc.enableTranslate = false;
    sc.enableZoom = false;
    sc.enableRotate = false;
    sc.enableTilt = false;
    sc.enableLook = false;
    setCamera(v, WAYPOINTS[0]);
  };

  // ------------------------------------------------------------
  // Keyboard shortcuts
  // ------------------------------------------------------------
  useEffect(() => {
    const onKey = (e) => {
      if (error) return;
      if (stage === 'intro' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startJourney();
      } else if (e.key === 'Escape') {
        if (stage === 'journey') skipToFinal();
      } else if (e.key.toLowerCase() === 'r' && stage === 'final') {
        replay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // startJourney / skipToFinal / replay are stable: they only read
    // refs and call setState. We intentionally list `stage` so a new
    // listener is bound when the user moves between stages.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, error]);

  // ------------------------------------------------------------
  // Cleanup timeline on unmount
  // ------------------------------------------------------------
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, []);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div className={`ez-root ${loaded ? 'is-loaded' : ''}`} aria-label="Earth to Mausoleum cinematic intro">
      <div className="ez-stars" aria-hidden="true" />
      <div className="ez-nebula" aria-hidden="true" />
      <div ref={containerRef} className="ez-canvas" />
      <div className="ez-vignette" aria-hidden="true" />

      {/* Loading screen — sits above everything until the first frame paints */}
      <div className={`ez-loader ${loaded ? 'is-hidden' : ''}`} role="status" aria-live="polite">
        <div className="ez-loader__inner">
          <div className="ez-loader__globe" />
          <div className="ez-loader__label">Calibrating orbit</div>
          <div className="ez-loader__sub">// loading satellite imagery //</div>
        </div>
      </div>

      {/* Fatal Cesium error — no fallback path can recover */}
      {error && (
        <div className="ez-error" role="alert">
          <div className="ez-error__panel">
            <h2 className="ez-error__title">Globe unavailable</h2>
            <p className="ez-error__body">
              Your browser could not start the 3D globe. Please reload the page,
              or try a recent Chrome, Edge, or Firefox build with WebGL enabled.
            </p>
            <button type="button" className="ez-cta" onClick={onEnter}>
              <span>CONTINUE WITHOUT GLOBE</span>
            </button>
          </div>
        </div>
      )}

      {/* Intro UI — title + EXPLORE button */}
      {!error && stage === 'intro' && (
        <>
          <header className="ez-headline">
            <p className="ez-kicker">// Unit 5 · Earth-to-Mausoleum //</p>
            <h1 className="ez-title">
              A Journey to
              <em>China&apos;s First Emperor</em>
            </h1>
            <p className="ez-sub">
              We begin 20,000 km above the Earth and descend to the resting
              place of Qin Shi Huang — three centuries before the empire he
              forged.
            </p>
          </header>

          <button
            type="button"
            className="ez-cta"
            onClick={startJourney}
            aria-label="Explore the journey"
          >
            <span>EXPLORE</span>
          </button>
          <div className="ez-cta-hint">PRESS ENTER OR SPACE</div>
        </>
      )}

      {/* Skip button while journey is in flight */}
      {!error && stage === 'journey' && (
        <div className="ez-controls ez-controls--top-right">
          <button type="button" className="ez-btn" onClick={skipToFinal} disabled={skipping}>
            <span className="ez-btn__dot" /> SKIP INTRO
          </button>
        </div>
      )}

      {/* Final destination panel + replay */}
      {!error && stage === 'final' && (
        <>
          <article className={`ez-panel is-shown`} aria-live="polite">
            <p className="ez-panel__eyebrow">// File 05 · Xi&apos;an, Shaanxi //</p>
            <h2 className="ez-panel__title">Mausoleum of Qin Shi Huang</h2>
            <p className="ez-panel__sub">The resting place of China&apos;s First Emperor.</p>
            <div className="ez-panel__meta">
              <span>LAT <strong>{MAUSOLEUM.lat.toFixed(3)}° N</strong></span>
              <span>LON <strong>{MAUSOLEUM.lon.toFixed(3)}° E</strong></span>
              <span>BUILT <strong>~246 BCE</strong></span>
            </div>
          </article>

          <div className="ez-controls ez-controls--top-right">
            <button type="button" className="ez-btn" onClick={replay}>
              <span className="ez-btn__dot" /> REPLAY JOURNEY
            </button>
          </div>

          <div className="ez-controls ez-controls--bottom-right">
            <button
              type="button"
              className="ez-cta"
              onClick={onEnter}
              aria-label="Enter the mausoleum"
            >
              <span>DISCOVER MORE</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
