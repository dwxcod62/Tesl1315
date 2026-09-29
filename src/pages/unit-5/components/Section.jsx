/**
 * Generic dossier section: kicker (small caps), title (serif), body slot.
 * Everything is a child — caller decides if it's prose, cards, or table.
 */
export default function Section({ kicker, title, id, children }) {
  return (
    <section className="dossier__section" id={id} aria-labelledby={`${id}-title`}>
      <div className="dossier__section-head">
        <span className="dossier__section-kicker">{kicker}</span>
        <h2 id={`${id}-title`} className="dossier__section-title">{title}</h2>
        <span className="dossier__section-mark" aria-hidden="true">§</span>
      </div>
      <div className="dossier__section-body">{children}</div>
    </section>
  );
}
