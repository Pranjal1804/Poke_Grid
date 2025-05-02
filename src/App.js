import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import PokemonCompare from './components/PokemonCompare';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOption, setSortOption] = useState('id-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (pokemonId) => {
    console.log('Toggle favorite for:', pokemonId);
    console.log('Current favorites:', favorites);
    
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(pokemonId)
        ? prevFavorites.filter(id => id !== pokemonId)
        : [...prevFavorites, pokemonId];
      
      console.log('New favorites:', newFavorites);
      return newFavorites;
    });
  };

  // Fetch Pokemon data
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
        // Fetch detailed information for each Pokemon
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
        console.error('Error fetching Pokemon data:', error);
        setError('Failed to fetch Pokemon data. Please try again later.');
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Filter and sort Pokemon
  useEffect(() => {
    let result = [...pokemon];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.id.toString().includes(term)
      );
    }
    
    // Filter by selected types
    if (selectedTypes.length > 0) {
      result = result.filter(p => 
        p.types.some(typeInfo => selectedTypes.includes(typeInfo.type.name))
      );
    }
    
    // Sort Pokemon
    switch (sortOption) {
      case 'id-asc':
        result.sort((a, b) => a.id - b.id);
        break;
      case 'id-desc':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredPokemon(result);
  }, [pokemon, searchTerm, selectedTypes, sortOption]);

  // Get random Pokemon
  const getRandomPokemon = () => {
    if (pokemon.length > 0) {
      const randomIndex = Math.floor(Math.random() * pokemon.length);
      return pokemon[randomIndex].id;
    }
    return null;
  };

  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <Navbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <div className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <PokemonList 
                    pokemon={filteredPokemon}
                    loading={loading}
                    error={error}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    types={types}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    getRandomPokemon={getRandomPokemon}
                  />
                } 
              />
              
              <Route 
                path="/favorites" 
                element={
                  <PokemonList 
                    pokemon={pokemon.filter(p => favorites.includes(p.id))}
                    loading={loading}
                    error={error}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    types={types}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    isFavoritesPage={true}
                  />
                } 
              />
              
              <Route 
                path="/pokemon/:id" 
                element={
                  <PokemonDetail 
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                } 
              />
              
              <Route 
                path="/compare" 
                element={
                  <PokemonCompare 
                    pokemon={pokemon}
                    favorites={favorites}
                  />
                } 
              />
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;