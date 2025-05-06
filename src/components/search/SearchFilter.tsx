import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import './SearchFilter.css';

interface SearchFilterProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  query: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, initialFilters = { query: '', location: '', minPrice: '', maxPrice: '' } }) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const resetFilters = () => {
    setFilters({ query: '', location: '', minPrice: '', maxPrice: '' });
    onSearch({ query: '', location: '', minPrice: '', maxPrice: '' });
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className="search-filter-container">
      <form className="search-filter-form" onSubmit={handleSubmit}>
        <div className="search-basic">
          <div className="search-input-group">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              name="query"
              value={filters.query}
              onChange={handleInputChange}
              placeholder="Search by property title or description"
              className="search-input"
            />
          </div>
          
          <button 
            type="button" 
            className="btn-advanced-filters"
            onClick={toggleAdvanced}
            aria-expanded={showAdvanced}
          >
            <SlidersHorizontal size={20} />
            <span>Filters</span>
          </button>
          
          <button type="submit" className="btn-search">
            Search
          </button>
        </div>
        
        {showAdvanced && (
          <div className="advanced-filters animate-slide-up">
            <div className="filter-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="minPrice">Min Price (₹)</label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleInputChange}
                  placeholder="Min price"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="maxPrice">Max Price (₹)</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleInputChange}
                  placeholder="Max price"
                  min="0"
                />
              </div>
              
              <button 
                type="button" 
                className="btn-reset"
                onClick={resetFilters}
              >
                <X size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchFilter;