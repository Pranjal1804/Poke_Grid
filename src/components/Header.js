import React, { useState, useEffect } from 'react';
import '../styles/Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <div className="pokeball">
            <div className="pokeball-top"></div>
            <div className="pokeball-bottom"></div>
            <div className="pokeball-center"></div>
          </div>
          <h1>
            <span className="title-animation">P</span>
            <span className="title-animation">o</span>
            <span className="title-animation">k</span>
            <span className="title-animation">é</span>
            
            <span className="title-spacer"></span>
            <span className="subtitle-animation">Cards</span>
          </h1>
        </div>
        <div className="adventure-badge">
          <span>Adventure Awaits!</span>
        </div>
      </div>
    </header>
  );
}

export default Header;