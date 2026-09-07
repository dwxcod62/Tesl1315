/**
 * StartScreen — full-bleed arena with a centered pixel-style button.
 * Sits over the same court/players/ball as Background, but dims them
 * and brings a single call-to-action into focus.
 */
export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen" role="dialog" aria-label="Start match">
      <div className="start-screen__veil" aria-hidden="true" />

      <div className="start-screen__inner">
        <div className="start-screen__crest" aria-hidden="true">
          <span className="crest__ball" />
          <span className="crest__net" />
          <span className="crest__label">VOLLEYBALL COMMUNITY LEAGUE</span>
        </div>

        <h1 className="start-screen__title">
          <span>BUILD A</span>
          <span>COMPETITIVE</span>
          <span>VOLLEYBALL CLUB</span>
        </h1>

        <p className="start-screen__sub">
          A plan to help people connect through volleyball.
        </p>

        <button
          type="button"
          className="start-btn"
          onClick={onStart}
          autoFocus
        >
          <span className="start-btn__chev" aria-hidden="true">▶</span>
          <span className="start-btn__label">START MATCH</span>
          <span className="start-btn__chev" aria-hidden="true">◀</span>
        </button>

        <p className="start-screen__hint">CLICK TO BEGIN — 10 vs 10</p>
      </div>
    </div>
  );
}
