import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import MultiSelectTypeFilter from './MultiSelectTypeFilter';
import SortSelector from './SortSelector';

function PokemonList({
  pokemon,
  loading,
  error,
  favorites,
  onToggleFavorite,
  types,
  selectedTypes,
  setSelectedTypes,
  sortOption,
  setSortOption,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  getRandomPokemon,
  isFavoritesPage = false
}) {
  const navigate = useNavigate();
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  // Filter and sort Pokemon for this page
  const displayedPokemon = useMemo(() => {
    // Apply local search filter (if any)
    let filteredPokemon = pokemon;
    if (localSearchTerm) {
      const term = localSearchTerm.toLowerCase();
      filteredPokemon = filteredPokemon.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.id.toString().includes(term)
      );
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredPokemon.slice(startIndex, endIndex);
  }, [pokemon, currentPage, itemsPerPage, localSearchTerm]);

  // Handle pagination
  const totalPages = useMemo(() => {
    let filteredCount = pokemon.length;
    if (localSearchTerm) {
      const term = localSearchTerm.toLowerCase();
      filteredCount = pokemon.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.id.toString().includes(term)
      ).length;
    }
    return Math.ceil(filteredCount / itemsPerPage);
  }, [pokemon, itemsPerPage, localSearchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle random pokemon
  const handleRandomPokemon = () => {
    const randomId = getRandomPokemon();
    if (randomId) {
      navigate(`/pokemon/${randomId}`);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader spin"></div>
        <p>Loading Pokémon data...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  // Render empty favorites
  if (isFavoritesPage && favorites.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">💔</div>
        <h2>No Favorite Pokémon</h2>
        <p>You haven't added any Pokémon to your favorites yet.</p>
        <button className="action-button" onClick={() => navigate('/')}>
          Browse Pokémon
        </button>
      </div>
    );
  }

  // Render empty results
  if (displayedPokemon.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🔍</div>
        <h2>No Pokémon Found</h2>
        <p>Try adjusting your search or filters.</p>
        <button 
          className="action-button" 
          onClick={() => {
            setLocalSearchTerm('');
            setSelectedTypes([]);
            setSortOption('id-asc');
          }}
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="pokemon-list-container">
      <div className="controls-container">
        <SearchBar 
          searchTerm={localSearchTerm} 
          onSearchChange={setLocalSearchTerm} 
        />
        
        <MultiSelectTypeFilter 
          types={types} 
          selectedTypes={selectedTypes} 
          onTypeChange={setSelectedTypes} 
        />
        
        <SortSelector 
          sortOption={sortOption} 
          onSortChange={setSortOption} 
        />
        
        <div className="items-per-page">
          <label htmlFor="items-per-page">Items per page:</label>
          <select 
            id="items-per-page" 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange}
            className="items-per-page-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="action-button" 
          onClick={handleRandomPokemon}
        >
          Random Pokémon
        </button>
        
        <button 
          className="action-button" 
          onClick={() => navigate(isFavoritesPage ? '/' : '/favorites')}
        >
          {isFavoritesPage ? 'All Pokémon' : 'My Favorites'}
        </button>
        
        <button 
          className="action-button" 
          onClick={() => navigate('/compare')}
        >
          Compare Pokémon
        </button>
      </div>
      
      <div className="pokemon-grid">
        {displayedPokemon.map(pokemon => (
          <PokemonCard 
            key={pokemon.id} 
            pokemon={pokemon}
            isFavorite={favorites.includes(pokemon.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          
          <button 
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          
          <button 
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}

export default PokemonList;