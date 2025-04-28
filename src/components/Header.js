import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="pokeball">
            <div className="pokeball-center"></div>
          </div>
          <h1>Pokédex Explorer</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;