import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PokemonCompare.css';

// Import typeColors from PokemonCard to maintain consistency
import { typeColors } from '../utils/typeColors';

function PokemonCompare({ pokemon, favorites }) {
  const navigate = useNavigate();
  const [selectedPokemon1, setSelectedPokemon1] = useState(null);
  const [selectedPokemon2, setSelectedPokemon2] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  
  useEffect(() => {
    if (pokemon && pokemon.length > 0) {
      // Sort Pokemon by ID
      const sortedPokemon = [...pokemon].sort((a, b) => a.id - b.id);
      setPokemonList(sortedPokemon);
      
      // Pre-select the first Pokemon if coming from favorites
      if (favorites.length > 0) {
        const firstFavorite = sortedPokemon.find(p => p.id === favorites[0]);
        if (firstFavorite) {
          setSelectedPokemon1(firstFavorite);
        }
        
        // If there's a second favorite, select it too
        if (favorites.length > 1) {
          const secondFavorite = sortedPokemon.find(p => p.id === favorites[1]);
          if (secondFavorite) {
            setSelectedPokemon2(secondFavorite);
          }
        }
      }
    }
  }, [pokemon, favorites]);
  
  const handleSelectPokemon = (pokemon, slot) => {
    if (slot === 1) {
      setSelectedPokemon1(pokemon);
      setSearchTerm1('');
    } else {
      setSelectedPokemon2(pokemon);
      setSearchTerm2('');
    }
  };
  
  const handleRandomSelect = (slot) => {
    if (pokemonList.length > 0) {
      const randomIndex = Math.floor(Math.random() * pokemonList.length);
      const randomPokemon = pokemonList[randomIndex];
      
      if (slot === 1) {
        setSelectedPokemon1(randomPokemon);
      } else {
        setSelectedPokemon2(randomPokemon);
      }
    }
  };
  
  // Filter the list based on search term
  const getFilteredList = (searchTerm) => {
    if (!searchTerm) return [];
    
    const term = searchTerm.toLowerCase();
    return pokemonList
      .filter(p => p.name.toLowerCase().includes(term) || p.id.toString().includes(term))
      .slice(0, 5);
  };
  
  const filteredList1 = getFilteredList(searchTerm1);
  const filteredList2 = getFilteredList(searchTerm2);
  
  return (
    <div className="compare-container">
      <div className="view-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to List
        </button>
        <h1 className="view-title">Compare Pokémon</h1>
      </div>
      
      <div className="compare-content">
        <div className="compare-columns">
          {/* Left column */}
          <div className="compare-column">
            <div className="pokemon-selector">
              <div className="selector-search">
                <input
                  type="text"
                  placeholder="Search for a Pokémon..."
                  value={searchTerm1}
                  onChange={(e) => setSearchTerm1(e.target.value)}
                  className="selector-input"
                />
                {searchTerm1 && filteredList1.length > 0 && (
                  <div className="search-results">
                    {filteredList1.map((p) => (
                      <div 
                        key={p.id} 
                        className="search-result-item"
                        onClick={() => handleSelectPokemon(p, 1)}
                      >
                        <span className="result-id">#{p.id.toString().padStart(3, '0')}</span>
                        <span className="result-name">{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="selector-buttons">
                <button 
                  className="selector-button"
                  onClick={() => handleRandomSelect(1)}
                >
                  Random
                </button>
              </div>
            </div>
            
            {selectedPokemon1 ? (
              <div className="pokemon-compare-card">
                <div className="compare-header">
                  <h2 className="compare-name">{selectedPokemon1.name}</h2>
                  <span className="compare-id">#{selectedPokemon1.id.toString().padStart(3, '0')}</span>
                </div>
                
                <div className="compare-image-container">
                  <img 
                    src={selectedPokemon1.sprites.other["official-artwork"].front_default || selectedPokemon1.sprites.front_default}
                    alt={selectedPokemon1.name}
                    className="compare-image"
                  />
                </div>
                
                <div className="compare-types">
                  {selectedPokemon1.types.map((typeInfo, index) => (
                    <span 
                      key={index} 
                      className="type-badge"
                      style={{
                        backgroundColor: typeColors[typeInfo.type.name] || typeColors.default,
                      }}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
                
                <div className="compare-stats">
                  {selectedPokemon1.stats.map((stat, index) => (
                    <div key={index} className="compare-stat">
                      <div className="stat-name">
                        {stat.stat.name.replace('-', ' ')}
                      </div>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar left-stat"
                          style={{ 
                            width: `${(stat.base_stat / 255) * 100}%`,
                            backgroundColor: 
                              stat.base_stat < 50 ? '#ff7675' : 
                              stat.base_stat < 100 ? '#fdcb6e' : '#00b894'
                          }}
                        ></div>
                        <span className="stat-value">{stat.base_stat}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="compare-stat total-stat">
                    <div className="stat-name">Total</div>
                    <div className="stat-bar-container">
                      <span className="stat-value total-value">
                        {selectedPokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-selection">
                <p>Select a Pokémon to compare</p>
              </div>
            )}
          </div>
          
          {/* Right column */}
          <div className="compare-column">
            <div className="pokemon-selector">
              <div className="selector-search">
                <input
                  type="text"
                  placeholder="Search for a Pokémon..."
                  value={searchTerm2}
                  onChange={(e) => setSearchTerm2(e.target.value)}
                  className="selector-input"
                />
                {searchTerm2 && filteredList2.length > 0 && (
                  <div className="search-results">
                    {filteredList2.map((p) => (
                      <div 
                        key={p.id} 
                        className="search-result-item"
                        onClick={() => handleSelectPokemon(p, 2)}
                      >
                        <span className="result-id">#{p.id.toString().padStart(3, '0')}</span>
                        <span className="result-name">{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="selector-buttons">
                <button 
                  className="selector-button"
                  onClick={() => handleRandomSelect(2)}
                >
                  Random
                </button>
              </div>
            </div>
            
            {selectedPokemon2 ? (
              <div className="pokemon-compare-card">
                <div className="compare-header">
                  <h2 className="compare-name">{selectedPokemon2.name}</h2>
                  <span className="compare-id">#{selectedPokemon2.id.toString().padStart(3, '0')}</span>
                </div>
                
                <div className="compare-image-container">
                  <img 
                    src={selectedPokemon2.sprites.other["official-artwork"].front_default || selectedPokemon2.sprites.front_default}
                    alt={selectedPokemon2.name}
                    className="compare-image"
                  />
                </div>
                
                <div className="compare-types">
                  {selectedPokemon2.types.map((typeInfo, index) => (
                    <span 
                      key={index} 
                      className="type-badge"
                      style={{
                        backgroundColor: typeColors[typeInfo.type.name] || typeColors.default,
                      }}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
                
                <div className="compare-stats">
                  {selectedPokemon2.stats.map((stat, index) => (
                    <div key={index} className="compare-stat">
                      <div className="stat-name">
                        {stat.stat.name.replace('-', ' ')}
                      </div>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar right-stat"
                          style={{ 
                            width: `${(stat.base_stat / 255) * 100}%`,
                            backgroundColor: 
                              stat.base_stat < 50 ? '#ff7675' : 
                              stat.base_stat < 100 ? '#fdcb6e' : '#00b894'
                          }}
                        ></div>
                        <span className="stat-value">{stat.base_stat}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="compare-stat total-stat">
                    <div className="stat-name">Total</div>
                    <div className="stat-bar-container">
                      <span className="stat-value total-value">
                        {selectedPokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-selection">
                <p>Select a Pokémon to compare</p>
              </div>
            )}
          </div>
        </div>
        
        {selectedPokemon1 && selectedPokemon2 && (
          <div className="comparison-summary">
            <h3 className="summary-title">Comparison Summary</h3>
            <div className="summary-content">
              {/* You can add a more detailed comparison here */}
              <p className="summary-text">
                {selectedPokemon1.name}'s total stats: {selectedPokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0)}
              </p>
              <p className="summary-text">
                {selectedPokemon2.name}'s total stats: {selectedPokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0)}
              </p>
              <p className="summary-result">
                {selectedPokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0) > 
                 selectedPokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0) 
                  ? `${selectedPokemon1.name} has higher total stats!`
                  : selectedPokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0) < 
                    selectedPokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0)
                    ? `${selectedPokemon2.name} has higher total stats!`
                    : 'Both Pokémon have equal total stats!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PokemonCompare;