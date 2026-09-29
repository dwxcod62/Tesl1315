export default function Header() {
  return (
    <header className="app-header">
      <div className="top-label">
        <span className="top-label__dot" aria-hidden="true" />
        <span>PLAYER 1 &nbsp;&bull;&nbsp; COMMUNITY SPORTS</span>
      </div>

      <h1 className="hero-title">
        BUILD A COMPETITIVE
        {' '}
        <span className="hero-title__accent">VOLLEYBALL CLUB</span>
      </h1>

      <p className="hero-subtitle">
        A plan to help people connect through volleyball.
      </p>
    </header>
  );
}
