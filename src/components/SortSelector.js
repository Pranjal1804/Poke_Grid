import React from 'react';
import '../styles/SortSelector.css';

function SortSelector({ sortOption, onSortChange }) {
  return (
    <div className="sort-selector">
      <label htmlFor="sort-select">Sort by:</label>
      <select
        id="sort-select"
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        <option value="id-asc">ID (Low to High)</option>
        <option value="id-desc">ID (High to Low)</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
}

export default SortSelector;