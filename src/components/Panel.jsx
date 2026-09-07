export default function Panel({ title, tag = 'LV. 01', children }) {
  return (
    <section className="panel">
      <div className="panel__head">
        <span className="panel__head-arrow" aria-hidden="true">
          &#9658;
        </span>
        <span className="panel__head-title">{title}</span>
        <span className="panel__head-tag">{tag}</span>
      </div>
      <div className="panel__body">{children}</div>
    </section>
  );
}
