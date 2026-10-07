import { useEffect, useState, lazy, Suspense } from 'react';

const Unit3App = lazy(() => import(/* webpackChunkName: "unit-3" */ './unit-4/Unit4App'));
const Unit4App = lazy(() => import(/* webpackChunkName: "unit-4" */ './unit-radioactivity/Unit5App'));
const Unit5App = lazy(() => import(/* webpackChunkName: "unit-5" */ './unit-5/Unit5App'));

const UNITS = [
  {
    id: 'unit-3',
    title: 'UNIT 3',
    subtitle: 'Friendly match rally · Scoreboard · Reasons & Benefits',
    accent: 'cyan',
    available: true,
  },
  {
    id: 'unit-4',
    title: 'UNIT 4',
    subtitle: 'Natural Radioactivity in Food · Dossier',
    accent: 'red',
    available: true,
  },
  {
    id: 'unit-5',
    title: 'UNIT 5',
    subtitle: 'Mausoleum of Qin Shi Huang · Terracotta Mystery',
    accent: 'amber',
    available: true,
  },
];

const UNIT_LOADERS = {
  'unit-3': Unit3App,
  'unit-4': Unit4App,
  'unit-5': Unit5App,
};

function getActiveUnitId() {
  if (typeof window === 'undefined') return null;
  const id = window.location.hash.replace('#', '');
  return UNITS.find((u) => u.id === id && u.available) ? id : null;
}

function goHome() {
  if (typeof window === 'undefined') return;
  if (window.location.hash) {
    window.location.hash = '';
    window.location.reload();
  }
}

function HomeButton() {
  return (
    <button type="button" className="home-btn" onClick={goHome} aria-label="Back to menu">
      ◂ HOME
    </button>
  );
}

export default function MainMenu() {
  const [activeId, setActiveId] = useState(getActiveUnitId);

  useEffect(() => {
    const onHash = () => setActiveId(getActiveUnitId());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (activeId) {
    const UnitView = UNIT_LOADERS[activeId];
    return (
      <div className="unit-page">
        <HomeButton />
        <Suspense fallback={<UnitLoading />}>
          <UnitView />
        </Suspense>
      </div>
    );
  }

  return <UnitGrid units={UNITS} />;
}

function UnitLoading() {
  return (
    <div className="unit-loading" role="status" aria-live="polite">
      <span className="unit-loading__dot" />
      <span className="unit-loading__dot" />
      <span className="unit-loading__dot" />
      <span className="unit-loading__label">Loading…</span>
    </div>
  );
}

function UnitGrid({ units }) {
  return (
    <div className="main-menu">
      <div className="main-menu__bg" aria-hidden="true" />
      <header className="main-menu__head">
        <h1 className="main-menu__title">TESL 1315</h1>
        <p className="main-menu__sub">Select a unit to start</p>
      </header>

      <div className="main-menu__grid">
        {units.map((u) => (
          <UnitCard key={u.id} unit={u} />
        ))}
      </div>

      <footer className="main-menu__foot">
        <span>// volleyball · community · culture //</span>
      </footer>
    </div>
  );
}

function UnitCard({ unit }) {
  const onClick = () => {
    if (!unit.available) return;
    window.location.hash = unit.id;
  };

  return (
    <button
      type="button"
      className={`unit-card unit-card--${unit.accent}${unit.available ? '' : ' unit-card--locked'}`}
      onClick={onClick}
      disabled={!unit.available}
    >
      <div className="unit-card__tag" aria-hidden="true">{unit.id.toUpperCase()}</div>
      <h2 className="unit-card__title">{unit.title}</h2>
      <p className="unit-card__sub">{unit.subtitle}</p>
      <div className="unit-card__cta">
        {unit.available ? 'ENTER ▸' : 'COMING SOON'}
      </div>
    </button>
  );
}
