import { STATS } from '../data/dossier';

/**
 * Top-of-page evidence strip: 3 quick stat cells + "EVIDENCE FILE" stamp.
 * Sits below the masthead, above the lede. Looks like a sidebar briefing box.
 */
export default function InvestigativeBanner() {
  return (
    <aside className="dossier__banner" aria-label="Case at a glance">
      <div className="dossier__banner-stamp" aria-hidden="true">
        <span>EVIDENCE</span>
        <span>FILE</span>
      </div>
      <ul className="dossier__stats">
        {STATS.map((s) => (
          <li key={s.label} className="dossier__stat">
            <span className="dossier__stat-label">{s.label}</span>
            <span className="dossier__stat-value">{s.value}</span>
            <span className="dossier__stat-note">{s.note}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
