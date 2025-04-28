import React, { useState, useEffect } from 'react';
import '../styles/PokemonCard.css';

// Define typeColors directly in the PokemonCard.js file
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

function PokemonCard({ pokemon }) {
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
    </div>
  );
}

export default PokemonCard;