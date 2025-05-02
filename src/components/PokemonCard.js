import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PokemonCard.css';
import { typeColors } from '../utils/typeColors';

function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isAbilitiesVisible, setIsAbilitiesVisible] = useState(false);

  useEffect(() => {
    if (isHovered) {
      const statsTimer = setTimeout(() => setIsStatsVisible(true), 200);
      const abilitiesTimer = setTimeout(() => setIsAbilitiesVisible(true), 400);
      
      return () => {
        clearTimeout(statsTimer);
        clearTimeout(abilitiesTimer);
      };
    } else {
      setIsStatsVisible(false);
      setIsAbilitiesVisible(false);
    }
  }, [isHovered]);

  // Get primary type for card styling
  const primaryType = pokemon.types[0].type.name;
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(pokemon.id);
  };
  
  const handleViewDetails = () => {
    navigate(`/pokemon/${pokemon.id}`);
  };
  
  return (
    <div 
      className={`pokemon-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `linear-gradient(to bottom, 
          ${typeColors[primaryType] || typeColors.default}33 0%, 
          white 100%)`,
      }}
    >
      <div className="favorite-button-container">
        <button 
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      
      <div className="pokemon-image-container">
        <div className="pokeball-background"></div>
        
        <img 
          src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="pokemon-image"
          loading="lazy"
        />
        
        <div className="pokemon-id">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>
      </div>
      
      <div className="pokemon-info">
        <h2 className="pokemon-name">{pokemon.name}</h2>
        
        <div className="pokemon-types">
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
        
        <div className={`pokemon-stats ${isStatsVisible ? 'visible' : ''}`}>
          <div className="stat">
            <div className="stat-label">HP</div>
            <div className="stat-value">
              {pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-label">Attack</div>
            <div className="stat-value">
              {pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-label">Defense</div>
            <div className="stat-value">
              {pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-label">Speed</div>
            <div className="stat-value">
              {pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat}
            </div>
          </div>
        </div>
      </div>
      
      <div className={`pokemon-abilities ${isAbilitiesVisible ? 'visible' : ''}`}>
        <div className="abilities-container">
          {pokemon.abilities.map((ability, index) => (
            <span key={index} className="ability-badge">
              {ability.ability.name.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
      
      <div className="pokemon-card-footer">
        <button 
          className="view-details-button"
          onClick={handleViewDetails}
          aria-label={`View details for ${pokemon.name}`}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default PokemonCard;