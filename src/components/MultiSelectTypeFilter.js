import React from 'react';
import '../styles/MultiSelectTypeFilter.css';

function MultiSelectTypeFilter({ types, selectedTypes, onTypeChange }) {
  const handleTypeClick = (type) => {
    if (selectedTypes.includes(type)) {
      // Remove type if already selected
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      // Add type if not selected
      onTypeChange([...selectedTypes, type]);
    }
  };

  const handleClearAll = () => {
    onTypeChange([]);
  };

  // Define type colors for consistency
  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    default: '#AAAAAA'
  };

  return (
    <div className="multi-select-filter">
      <div className="filter-header">
        <h3>Filter by Type</h3>
        {selectedTypes.length > 0 && (
          <button className="clear-filter" onClick={handleClearAll}>
            Clear All
          </button>
        )}
      </div>
      
      <div className="type-buttons">
        {types.map(type => (
          <button
            key={type}
            className={`type-button ${selectedTypes.includes(type) ? 'selected' : ''}`}
            style={{
              backgroundColor: selectedTypes.includes(type) ? typeColors[type] : 'transparent',
              color: selectedTypes.includes(type) ? 'white' : '#333',
              borderColor: typeColors[type]
            }}
            onClick={() => handleTypeClick(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MultiSelectTypeFilter;