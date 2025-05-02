import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PokemonDetail.css';

// Import typeColors from PokemonCard to maintain consistency
import { typeColors } from '../utils/typeColors';

function PokemonDetail({ favorites, onToggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        // Fetch basic Pokemon data
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!pokemonResponse.ok) throw new Error('Pokemon not found');
        const pokemonData = await pokemonResponse.json();
        setPokemon(pokemonData);
        
        // Fetch species data
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);
        
        // Fetch evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        setEvolutionChain(evolutionData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchPokemonDetails();
  }, [id]);
  
  const getEvolutionStages = (chain) => {
    const stages = [];
    let current = chain;
    
    // Process current evolution
    stages.push({
      name: current.species.name,
      url: current.species.url
    });
    
    // Process further evolutions
    while (current.evolves_to.length > 0) {
      current = current.evolves_to[0];
      stages.push({
        name: current.species.name,
        url: current.species.url
      });
    }
    
    return stages;
  };
  
  const handleFavoriteClick = () => {
    onToggleFavorite(pokemon.id);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader spin"></div>
        <p>Loading Pokémon details...</p>
      </div>
    );
  }
  
  if (error || !pokemon) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Pokémon</h2>
        <p>{error || 'Something went wrong'}</p>
        <button className="action-button" onClick={() => navigate('/')}>
          Back to List
        </button>
      </div>
    );
  }
  
  // Extract evolution stages if available
  const evolutionStages = evolutionChain ? getEvolutionStages(evolutionChain.chain) : [];
  
  // Extract English flavor text
  const flavorText = species?.flavor_text_entries?.find(
    entry => entry.language.name === 'en'
  )?.flavor_text.replace(/\f/g, ' ');
  
  return (
    <div className="pokemon-detail-container">
      <div className="view-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="view-title">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          <span className="pokemon-number">#{pokemon.id.toString().padStart(3, '0')}</span>
        </h1>
        <button 
          className={`favorite-button detail-favorite ${favorites.includes(pokemon.id) ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorites.includes(pokemon.id) ? "Remove from favorites" : "Add to favorites"}
        >
          {favorites.includes(pokemon.id) ? '★' : '☆'}
        </button>
      </div>
      
      <div className="pokemon-detail-content">
        <div className="pokemon-detail-main">
          <div className="pokemon-detail-image-container">
            <img 
              src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="pokemon-detail-image"
            />
            
            <div className="pokemon-detail-types">
              {pokemon.types.map((typeInfo, index) => (
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
          </div>
          
          <div className="pokemon-detail-info">
            <p className="pokemon-flavor-text">{flavorText || 'No description available.'}</p>
            
            <div className="pokemon-metrics">
              <div className="metric">
                <span className="metric-label">Height</span>
                <span className="metric-value">{pokemon.height / 10} m</span>
              </div>
              <div className="metric">
                <span className="metric-label">Weight</span>
                <span className="metric-value">{pokemon.weight / 10} kg</span>
              </div>
            </div>
            
            <div className="tab-container">
              <div className="tab-buttons">
                <button 
                  className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stats')}
                >
                  Stats
                </button>
                <button 
                  className={`tab-button ${activeTab === 'abilities' ? 'active' : ''}`}
                  onClick={() => setActiveTab('abilities')}
                >
                  Abilities
                </button>
                <button 
                  className={`tab-button ${activeTab === 'moves' ? 'active' : ''}`}
                  onClick={() => setActiveTab('moves')}
                >
                  Moves
                </button>
                <button 
                  className={`tab-button ${activeTab === 'evolution' ? 'active' : ''}`}
                  onClick={() => setActiveTab('evolution')}
                >
                  Evolution
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'stats' && (
                  <div className="stats-tab">
                    {pokemon.stats.map((stat, index) => (
                      <div key={index} className="stat-bar">
                        <div className="stat-name">
                          {stat.stat.name.replace('-', ' ')}
                        </div>
                        <div className="stat-value-container">
                          <div 
                            className="stat-value-bar"
                            style={{ 
                              width: `${(stat.base_stat / 255) * 100}%`,
                              backgroundColor: 
                                stat.base_stat < 50 ? '#ff7675' : 
                                stat.base_stat < 100 ? '#fdcb6e' : '#00b894'
                            }}
                          ></div>
                          <span className="stat-value-number">{stat.base_stat}</span>
                        </div>
                      </div>
                    ))}
                    <div className="stat-total">
                      <div className="stat-name">Total</div>
                      <div className="stat-total-value">
                        {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'abilities' && (
                  <div className="abilities-tab">
                    {pokemon.abilities.map((ability, index) => (
                      <div key={index} className="ability-item">
                        <h3 className="ability-name">
                          {ability.ability.name.replace('-', ' ')}
                          {ability.is_hidden && <span className="hidden-badge">Hidden</span>}
                        </h3>
                        <p className="ability-effect">
                          Effect information would be loaded here
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'moves' && (
                  <div className="moves-tab">
                    <div className="moves-list">
                      {pokemon.moves.slice(0, 20).map((move, index) => (
                        <div key={index} className="move-item">
                          {move.move.name.replace('-', ' ')}
                        </div>
                      ))}
                    </div>
                    {pokemon.moves.length > 20 && (
                      <p className="moves-note">
                        Showing 20 of {pokemon.moves.length} moves
                      </p>
                    )}
                  </div>
                )}
                
                {activeTab === 'evolution' && (
                  <div className="evolution-tab">
                    {evolutionStages.length > 0 ? (
                      <div className="evolution-chain">
                        {evolutionStages.map((stage, index) => (
                          <div key={index} className="evolution-stage">
                            <div className="evolution-pokemon">
                              <h3 className="evolution-name">
                                {stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}
                              </h3>
                              <div className="evolution-image-placeholder">
                                {/* Would load image here based on ID */}
                                {stage.name}
                              </div>
                            </div>
                            
                            {index < evolutionStages.length - 1 && (
                              <div className="evolution-arrow">
                                →
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-evolution">
                        No evolution information available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;