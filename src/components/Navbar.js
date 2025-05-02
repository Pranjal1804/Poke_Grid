import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <span className="logo-text">Pokédex</span>
          </Link>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/favorites" className="nav-link">Favorites</Link>
          <Link to="/compare" className="nav-link">Compare</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;