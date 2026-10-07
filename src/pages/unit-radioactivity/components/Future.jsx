import { FUTURE } from '../data/dossier';

/**
 * "The Future of Nuclear in Tech" — closer card.
 * Highlighted wrap-up: same dossier styling, with a "FORWARD LOOK" tag.
 */
export default function Future() {
  return (
    <article className="dossier__future">
      <div className="dossier__future-head">
        <span className="dossier__future-tag">FORWARD LOOK</span>
        <span className="dossier__future-rule" />
      </div>
      <h3 className="dossier__future-title">{FUTURE.title}</h3>
      {FUTURE.body.map((p, i) => (
        <p key={i} className="dossier__future-body">{p}</p>
      ))}
      <p className="dossier__future-coda">{FUTURE.coda}</p>
    </article>
  );
}
