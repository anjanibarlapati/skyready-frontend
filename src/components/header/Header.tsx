export const Header = () => {
  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="logo-group">
            <img src="/logo.png" alt="SkyReady Logo" className="logo-img" />
          </div>
          <nav className="nav-links">
            <a href="/" className="nav-button">
              Home
            </a>
            <a href="#about-us" className="nav-button">
              About Us
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
};
