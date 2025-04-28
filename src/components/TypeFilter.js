import React from 'react';
import { FilterIcon } from '../icons/icons';
import '../styles/SearchFilter.css';

function TypeFilter({ types, selectedType, onTypeChange }) {
  return (
    <div className="filter-container">
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="filter-select"
      >
        <option value="">All Types</option>
        {types.map(type => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
      <div className="filter-icon">
        <FilterIcon />
      </div>
    </div>
  );
}

export default TypeFilter;