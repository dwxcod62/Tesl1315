import { META, HEADLINE } from '../data/dossier';

/**
 * Newspaper-style masthead: thin top rule, big serif headline, byline, meta row.
 */
export default function Masthead() {
  return (
    <header className="dossier__masthead">
      <div className="dossier__confidential-strip" aria-hidden="true">
        <span>★</span><span>CONFIDENTIAL</span><span>★</span>
        <span>DOSSIER №05</span><span>★</span>
        <span>OFFICE OF NUCLEAR ENERGY</span><span>★</span>
        <span>CONFIDENTIAL</span><span>★</span>
        <span>DOSSIER №05</span><span>★</span>
        <span>HANDLE WITH CARE</span><span>★</span>
        <span>CONFIDENTIAL</span><span>★</span>
      </div>
      <div className="dossier__masthead-row">
        <span>{META.kicker}</span>
        <span>{META.dateline}</span>
      </div>
      <div className="dossier__rule" />
      <h1 className="dossier__headline">
        <span className="dossier__kicker">{HEADLINE.pre}</span>
        <span className="dossier__title">{HEADLINE.main}</span>
        <span className="dossier__sub">{HEADLINE.sub}</span>
      </h1>
      <div className="dossier__rule dossier__rule--double" />
      <div className="dossier__byline">
        <span className="dossier__byline-author">By {META.author}</span>
        <span className="dossier__byline-dot" aria-hidden="true">·</span>
        <span>{META.date}</span>
        <span className="dossier__byline-dot" aria-hidden="true">·</span>
        <span className="dossier__byline-read">Estimated read time: {META.readTime} min</span>
      </div>
    </header>
  );
}
