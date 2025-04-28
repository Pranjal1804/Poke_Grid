import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PokemonCard from './components/PokemonCard';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import { LoaderIcon } from './icons/icons';
import './styles/App.css';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState([]);

  // Fetch Pokemon data
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();
        
        // Fetch detailed data for each Pokemon
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            return await detailResponse.json();
          })
        );
        
        // Extract all unique types
        const allTypes = new Set();
        pokemonDetails.forEach(pokemon => {
          pokemon.types.forEach(typeInfo => {
            allTypes.add(typeInfo.type.name);
          });
        });
        
        setTypes(Array.from(allTypes).sort());
        setPokemon(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch Pokémon data. Please try again later.");
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Filter pokemon based on search term and selected type
  useEffect(() => {
    let results = pokemon;
    
    if (searchTerm) {
      results = results.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType) {
      results = results.filter(p => 
        p.types.some(t => t.type.name === selectedType)
      );
    }
    
    setFilteredPokemon(results);
  }, [searchTerm, selectedType, pokemon]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      
      <div className="search-filter-container">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
        <TypeFilter 
          types={types} 
          selectedType={selectedType} 
          onTypeChange={handleTypeChange} 
        />
      </div>

      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loader"><LoaderIcon /></div>
            <p>Loading Pokémon data...</p>
          </div>
        ) : filteredPokemon.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h2>No Pokémon Found</h2>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="pokemon-grid">
            {filteredPokemon.map((poke) => (
              <PokemonCard key={poke.id} pokemon={poke} />
            ))}
          </div>
        )}
      </main>
      
      <footer className="footer">
        <p>Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a></p>
      </footer>
    </div>
  );
}

export default App;