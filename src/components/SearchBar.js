import React from 'react';
import { SearchIcon } from '../icons/icons';
import '../styles/SearchFilter.css';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <div className="search-icon">
        <SearchIcon />
      </div>
    </div>
  );
}

export default SearchBar;