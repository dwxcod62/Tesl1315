export default function ItemCard({ index, title, body, icon }) {
  return (
    <article className="item">
      <div className="item__badge" aria-hidden="true">
        {index}
      </div>
      <div className="item__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="item__text">
        <h3 className="item__title">{title}</h3>
        <p className="item__desc">{body}</p>
      </div>
    </article>
  );
}
