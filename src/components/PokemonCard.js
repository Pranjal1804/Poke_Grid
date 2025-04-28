import React, { useState } from 'react';
import '../styles/PokemonCard.css';

function PokemonCard({ pokemon }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get type color
  const getTypeColor = (type) => {
    const colors = {
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
    };
    
    return colors[type] || '#A8A878';
  };

  return (
    <div 
      className={`pokemon-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pokemon-image-container">
        <div className="pokeball-background"></div>
        
        <img 
          src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="pokemon-image"
        />
        
        <div className="pokemon-id">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>
      </div>
      
      <div className="pokemon-info">
        <h2 className="pokemon-name">{pokemon.name}</h2>
        
        <div className="pokemon-types">
          {pokemon.types.map((typeInfo) => (
            <span 
              key={typeInfo.type.name}
              className="type-badge"
              style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>
        
        <div className={`pokemon-stats ${isHovered ? 'visible' : ''}`}>
          <div className="stat">
            <p className="stat-label">Height</p>
            <p className="stat-value">{pokemon.height / 10} m</p>
          </div>
          <div className="stat">
            <p className="stat-label">Weight</p>
            <p className="stat-value">{pokemon.weight / 10} kg</p>
          </div>
        </div>
      </div>
      
      <div className={`pokemon-abilities ${isHovered ? 'visible' : ''}`}>
        <div className="abilities-container">
          {pokemon.abilities.slice(0, 2).map((abilityInfo) => (
            <span 
              key={abilityInfo.ability.name}
              className="ability-badge"
            >
              {abilityInfo.ability.name.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;